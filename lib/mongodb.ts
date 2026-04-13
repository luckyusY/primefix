import {
  MongoClient,
  MongoNetworkError,
  MongoServerSelectionError,
  type Db,
} from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI?.trim();
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME?.trim() || "projectprimefixhub";
const IS_SERVERLESS_RUNTIME = Boolean(
  process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT,
);
const MONGO_FAILURE_COOLDOWN_MS = 30_000;
const MONGODB_OPTIONS = {
  connectTimeoutMS: 4_000,
  maxPoolSize: 8,
  retryWrites: true,
  serverSelectionTimeoutMS: 4_000,
  socketTimeoutMS: 6_000,
};

type MongoCache = {
  client: MongoClient | null;
  lastFailureAt: number | null;
  promise: Promise<MongoClient> | null;
};

const globalForMongo = globalThis as typeof globalThis & {
  __primefixMongo?: MongoCache;
};

const mongoCache =
  globalForMongo.__primefixMongo ??
  (globalForMongo.__primefixMongo = {
    client: null,
    lastFailureAt: null,
    promise: null,
  });

export function hasMongoConfig() {
  return Boolean(MONGODB_URI);
}

export function getMongoDbName() {
  return MONGODB_DB_NAME;
}

function isRetryableMongoError(error: unknown) {
  if (
    error instanceof MongoNetworkError ||
    error instanceof MongoServerSelectionError
  ) {
    return true;
  }

  const message = error instanceof Error ? error.message : String(error);
  return /ECONNRESET|ETIMEDOUT|socket|topology|connection|timed out/i.test(
    message,
  );
}

async function resetMongoCache() {
  const currentClient = mongoCache.client;
  mongoCache.client = null;
  mongoCache.promise = null;

  if (!currentClient) return;

  try {
    await currentClient.close();
  } catch {
    // Swallow close errors so the next connection attempt can proceed.
  }
}

async function connectMongoClient(
  fresh = false,
): Promise<MongoClient | null> {
  if (!MONGODB_URI) return null;

  const isCoolingDown =
    !IS_SERVERLESS_RUNTIME &&
    mongoCache.lastFailureAt !== null &&
    Date.now() - mongoCache.lastFailureAt < MONGO_FAILURE_COOLDOWN_MS;

  if (isCoolingDown) {
    return null;
  }

  if (fresh) {
    await resetMongoCache();
  }

  if (mongoCache.client) {
    return mongoCache.client;
  }

  if (!mongoCache.promise) {
    const client = new MongoClient(MONGODB_URI, MONGODB_OPTIONS);
    mongoCache.promise = client.connect().catch((error) => {
      mongoCache.lastFailureAt = Date.now();
      mongoCache.promise = null;
      throw error;
    });
  }

  try {
    mongoCache.client = await mongoCache.promise;
    mongoCache.lastFailureAt = null;
    return mongoCache.client;
  } catch (error) {
    mongoCache.lastFailureAt = Date.now();
    mongoCache.promise = null;
    throw error;
  }
}

export async function getMongoDb(options?: { fresh?: boolean }): Promise<Db | null> {
  const client = await connectMongoClient(options?.fresh);
  if (!client) return null;
  return client.db(MONGODB_DB_NAME);
}

export async function withMongoDb<T>(
  operation: (db: Db) => Promise<T>,
): Promise<T | null> {
  if (!MONGODB_URI) return null;

  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const db = await getMongoDb({ fresh: attempt > 0 });
      if (!db) return null;

      return await operation(db);
    } catch (error) {
      lastError = error;

      if (!isRetryableMongoError(error) || attempt === 1) {
        throw error;
      }
    }
  }

  throw lastError ?? new Error("Unable to connect to MongoDB.");
}
