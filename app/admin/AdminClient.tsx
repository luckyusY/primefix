"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  ChangeEvent,
  CSSProperties,
  Dispatch,
  FormEvent,
  ReactNode,
  SetStateAction,
} from "react";
import type {
  Content,
  ContentKey,
  FaqItem,
  Project,
  Review,
  Step,
} from "@/lib/types";
import type {
  AdminMediaDeleteResponse,
  AdminMediaAsset,
  AdminMediaListResponse,
  AdminMediaUploadResponse,
} from "@/lib/media";
import {
  DEFAULT_PROJECT_MEDIA_FOLDER,
  MEDIA_LIBRARY_PAGE_SIZE,
  normalizeMediaFolder,
} from "@/lib/media";
import { getAdminPreviewSrc } from "@/lib/media-images";

const uid = () => Math.random().toString(36).slice(2, 10);

const emptyProject = (): Project => ({
  id: uid(),
  kicker: "Project",
  title: "",
  description: "",
  scope: "",
  outcome: "",
  tags: [],
  images: [{ src: "", alt: "" }],
});

const tagsToString = (tags: string[]) => tags.join(", ");
const parseTags = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const getImageSlotKey = (projectId: string, imageIndex: number) =>
  `${projectId}:${imageIndex}`;

const formatBytes = (bytes: number) => {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatAssetName = (asset: AdminMediaAsset) => {
  if (asset.originalFilename) return asset.originalFilename;

  const fallback = asset.publicId.split("/").pop() ?? asset.publicId;
  return fallback || "Uploaded image";
};

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 9999,
        background: ok ? "#0d9488" : "#dc2626",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: 8,
        fontFamily: "system-ui,sans-serif",
        fontSize: 14,
        fontWeight: 500,
        boxShadow: "0 4px 20px rgba(0,0,0,.35)",
      }}
    >
      {msg}
    </div>
  );
}

interface Props {
  isAuthenticated: boolean;
  initialContent: Content | null;
}

function LoginScreen() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });

    setBusy(false);

    if (res.ok) {
      window.location.reload();
      return;
    }

    setErr("Incorrect password.");
  }

  return (
    <div style={S.loginWrap}>
      <div style={S.loginCard}>
        <div style={S.loginLogo}>PF</div>
        <h1 style={S.loginTitle}>PrimeFix Hub Admin</h1>
        <p style={S.loginSub}>Sign in to manage your site content</p>

        <form onSubmit={submit} style={{ marginTop: 24 }}>
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            style={S.input}
            required
            autoFocus
          />
          {err ? <p style={S.errMsg}>{err}</p> : null}
          <button type="submit" disabled={busy} style={S.btnPrimary}>
            {busy ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

type Tab = "reviews" | "faqs" | "steps" | "projects" | "media";

function Dashboard({ initialContent }: { initialContent: Content }) {
  const [content, setContent] = useState(initialContent);
  const [tab, setTab] = useState<Tab>("reviews");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [saving, setSaving] = useState<ContentKey | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    window.setTimeout(() => setToast(null), 3000);
  };

  async function logout() {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    window.location.reload();
  }

  async function save(key: ContentKey) {
    setSaving(key);
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: content[key] }),
    });
    setSaving(null);

    if (res.ok) {
      showToast("Saved successfully!", true);
      return;
    }

    const data = await res.json();
    showToast(data.error ?? "Save failed", false);
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "reviews", label: "Reviews" },
    { key: "faqs", label: "FAQs" },
    { key: "steps", label: "How It Works" },
    { key: "projects", label: "Projects" },
    { key: "media", label: "Media" },
  ];

  return (
    <div style={S.dashWrap}>
      <header style={S.topBar}>
        <div style={S.topBarInner}>
          <span style={S.topBarBrand}>
            <span style={S.topBarLogo}>PF</span>
            PrimeFix Hub Admin
          </span>
          <button onClick={logout} style={S.btnLogout}>
            Log out
          </button>
        </div>
      </header>

      <div style={S.tabBar}>
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            style={{
              ...S.tabBtn,
              ...(tab === item.key ? S.tabBtnActive : {}),
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <main style={S.main}>
        {tab === "reviews" ? (
          <ReviewsTab
            content={content}
            setContent={setContent}
            saving={saving}
            save={save}
            showToast={showToast}
          />
        ) : null}
        {tab === "faqs" ? (
          <FaqsTab
            content={content}
            setContent={setContent}
            saving={saving}
            save={save}
            showToast={showToast}
          />
        ) : null}
        {tab === "steps" ? (
          <StepsTab
            content={content}
            setContent={setContent}
            saving={saving}
            save={save}
            showToast={showToast}
          />
        ) : null}
        {tab === "projects" ? (
          <ProjectsManagerTab
            content={content}
            setContent={setContent}
            saving={saving}
            save={save}
            showToast={showToast}
          />
        ) : null}
        {tab === "media" ? <MediaTab showToast={showToast} /> : null}
      </main>

      {toast ? <Toast msg={toast.msg} ok={toast.ok} /> : null}
    </div>
  );
}

function Section({
  title,
  count,
  saving,
  sectionKey,
  onSave,
  onAdd,
  children,
}: {
  title: string;
  count: number;
  saving: ContentKey | null;
  sectionKey: ContentKey;
  onSave: () => void;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <div style={S.sectionHead}>
        <div>
          <h2 style={S.sectionTitle}>{title}</h2>
          <p style={S.sectionCount}>
            {count} item{count !== 1 ? "s" : ""}
          </p>
        </div>
        <div style={S.sectionActions}>
          <button onClick={onAdd} style={S.btnSecondary}>
            + Add
          </button>
          <button
            onClick={onSave}
            disabled={saving === sectionKey}
            style={S.btnPrimaryInline}
          >
            {saving === sectionKey ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div style={S.stack}>{children}</div>
    </div>
  );
}

function Card({
  onDelete,
  children,
}: {
  onDelete: () => void;
  children: ReactNode;
}) {
  return (
    <div style={S.card}>
      <div style={{ flex: 1 }}>{children}</div>
      <button onClick={onDelete} style={S.btnDelete} title="Delete">
        x
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={S.fieldLabel}>{label}</label>
      {children}
    </div>
  );
}

function ImagePreview({
  src,
  alt,
  label,
}: {
  src: string;
  alt: string;
  label: string;
}) {
  if (!src.trim()) {
    return (
      <div style={S.mediaPreviewEmpty}>
        <strong>No image selected</strong>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div style={S.mediaPreviewFrame}>
      <img
        src={getAdminPreviewSrc(src)}
        alt={alt || label}
        style={S.mediaPreviewImage}
        loading="lazy"
      />
    </div>
  );
}

function useMediaLibrary(showToast: (msg: string, ok: boolean) => void) {
  const [folderInput, setFolderInput] = useState(DEFAULT_PROJECT_MEDIA_FOLDER);
  const [galleryFolder, setGalleryFolder] = useState(
    DEFAULT_PROJECT_MEDIA_FOLDER,
  );
  const [mediaAssets, setMediaAssets] = useState<AdminMediaAsset[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryLoadingMore, setGalleryLoadingMore] = useState(false);
  const [galleryError, setGalleryError] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [mediaBusyId, setMediaBusyId] = useState<string | null>(null);

  const loadGalleryPage = useCallback(
    async ({
      folder,
      cursor,
      append = false,
    }: {
      folder: string;
      cursor?: string | null;
      append?: boolean;
    }) => {
      if (append) setGalleryLoadingMore(true);
      else setGalleryLoading(true);

      setGalleryError("");

      try {
        const query = new URLSearchParams({
          folder,
          limit: String(MEDIA_LIBRARY_PAGE_SIZE),
        });

        if (cursor) {
          query.set("next_cursor", cursor);
        }

        const res = await fetch(`/api/admin/media?${query.toString()}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as Partial<AdminMediaListResponse> & {
          error?: string;
        };

        if (!res.ok) {
          throw new Error(data.error ?? "Unable to load media library.");
        }

        const assets = Array.isArray(data.assets) ? data.assets : [];

        setMediaAssets((current) => {
          if (!append) return assets;

          const existing = new Set(current.map((asset) => asset.assetId));
          const appended = assets.filter((asset) => !existing.has(asset.assetId));
          return [...current, ...appended];
        });
        setNextCursor(data.nextCursor ?? null);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load media library.";
        setGalleryError(message);
      } finally {
        if (append) setGalleryLoadingMore(false);
        else setGalleryLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadGalleryPage({ folder: galleryFolder });
  }, [galleryFolder, loadGalleryPage]);

  const refreshGallery = useCallback(async () => {
    await loadGalleryPage({ folder: galleryFolder });
  }, [galleryFolder, loadGalleryPage]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || galleryLoadingMore) return;

    await loadGalleryPage({
      folder: galleryFolder,
      cursor: nextCursor,
      append: true,
    });
  }, [galleryFolder, galleryLoadingMore, loadGalleryPage, nextCursor]);

  const loadFolder = useCallback(() => {
    const nextFolder = normalizeMediaFolder(folderInput);
    setFolderInput(nextFolder);
    setGalleryFolder(nextFolder);
  }, [folderInput]);

  const ingestAssets = useCallback((assets: AdminMediaAsset[]) => {
    if (assets.length === 0) return;

    setMediaAssets((current) => {
      const next = [...current];

      assets
        .slice()
        .reverse()
        .forEach((asset) => {
          const existingIndex = next.findIndex(
            (currentAsset) => currentAsset.assetId === asset.assetId,
          );

          if (existingIndex >= 0) {
            next.splice(existingIndex, 1);
          }

          next.unshift(asset);
        });

      return next;
    });
  }, []);

  const uploadFiles = useCallback(
    async (incomingFiles: File[] | FileList) => {
      const files = Array.from(incomingFiles);
      if (files.length === 0) return [] as AdminMediaAsset[];

      const uploadedAssets: AdminMediaAsset[] = [];

      for (const file of files) {
        const form = new FormData();
        form.set("file", file);
        form.set("folder", galleryFolder);

        const res = await fetch("/api/admin/media", {
          method: "POST",
          body: form,
        });
        const data = (await res.json()) as Partial<AdminMediaUploadResponse> & {
          error?: string;
        };

        if (!res.ok) {
          throw new Error(data.error ?? "Unable to upload image.");
        }

        if (!data.asset) {
          throw new Error("Upload completed without a usable image response.");
        }

        uploadedAssets.push(data.asset);
      }

      ingestAssets(uploadedAssets);
      showToast(
        uploadedAssets.length === 1
          ? `Uploaded to ${galleryFolder}.`
          : `${uploadedAssets.length} images uploaded to ${galleryFolder}.`,
        true,
      );

      return uploadedAssets;
    },
    [galleryFolder, ingestAssets, showToast],
  );

  const deleteAsset = useCallback(
    async (asset: AdminMediaAsset) => {
      setMediaBusyId(asset.assetId);

      try {
        const res = await fetch("/api/admin/media", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: asset.publicId }),
        });
        const data = (await res.json()) as Partial<AdminMediaDeleteResponse> & {
          error?: string;
        };

        if (!res.ok) {
          throw new Error(data.error ?? "Unable to delete image.");
        }

        setMediaAssets((current) =>
          current.filter((currentAsset) => currentAsset.assetId !== asset.assetId),
        );
        showToast("Image deleted from Cloudinary.", true);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to delete image.";
        showToast(message, false);
      } finally {
        setMediaBusyId(null);
      }
    },
    [showToast],
  );

  return {
    deleteAsset,
    folderInput,
    galleryError,
    galleryFolder,
    galleryLoading,
    galleryLoadingMore,
    loadFolder,
    loadMore,
    mediaAssets,
    mediaBusyId,
    nextCursor,
    refreshGallery,
    setFolderInput,
    uploadFiles,
  };
}

function ReviewsTab({ content, setContent, saving, save }: TabProps) {
  const reviews = content.reviews;

  const update = useCallback(
    (id: string, field: keyof Review, val: string) => {
      setContent((current) => ({
        ...current,
        reviews: current.reviews.map((review) =>
          review.id === id ? { ...review, [field]: val } : review,
        ),
      }));
    },
    [setContent],
  );

  const add = () =>
    setContent((current) => ({
      ...current,
      reviews: [
        ...current.reviews,
        { id: uid(), name: "", type: "Homeowner", text: "" },
      ],
    }));

  const del = (id: string) =>
    setContent((current) => ({
      ...current,
      reviews: current.reviews.filter((review) => review.id !== id),
    }));

  return (
    <Section
      title="Client Reviews"
      count={reviews.length}
      saving={saving}
      sectionKey="reviews"
      onSave={() => save("reviews")}
      onAdd={add}
    >
      {reviews.map((review) => (
        <Card key={review.id} onDelete={() => del(review.id)}>
          <div style={S.row2}>
            <Field label="Name">
              <input
                style={S.input}
                value={review.name}
                onChange={(e) => update(review.id, "name", e.target.value)}
                placeholder="Client name"
              />
            </Field>
            <Field label="Type">
              <select
                style={S.input}
                value={review.type}
                onChange={(e) => update(review.id, "type", e.target.value)}
              >
                <option>Homeowner</option>
                <option>Landlord</option>
                <option>Tenant</option>
                <option>Property Manager</option>
              </select>
            </Field>
          </div>
          <Field label="Review Text">
            <textarea
              style={{ ...S.input, ...S.textarea }}
              value={review.text}
              onChange={(e) => update(review.id, "text", e.target.value)}
              placeholder="Review text..."
            />
          </Field>
        </Card>
      ))}
    </Section>
  );
}

function FaqsTab({ content, setContent, saving, save }: TabProps) {
  const faqs = content.faqs;

  const update = useCallback(
    (id: string, field: keyof FaqItem, val: string) => {
      setContent((current) => ({
        ...current,
        faqs: current.faqs.map((faq) =>
          faq.id === id ? { ...faq, [field]: val } : faq,
        ),
      }));
    },
    [setContent],
  );

  const add = () =>
    setContent((current) => ({
      ...current,
      faqs: [...current.faqs, { id: uid(), question: "", answer: "" }],
    }));

  const del = (id: string) =>
    setContent((current) => ({
      ...current,
      faqs: current.faqs.filter((faq) => faq.id !== id),
    }));

  return (
    <Section
      title="Frequently Asked Questions"
      count={faqs.length}
      saving={saving}
      sectionKey="faqs"
      onSave={() => save("faqs")}
      onAdd={add}
    >
      {faqs.map((faq, index) => (
        <Card key={faq.id} onDelete={() => del(faq.id)}>
          <p style={S.cardIdx}>Question {index + 1}</p>
          <Field label="Question">
            <input
              style={S.input}
              value={faq.question}
              onChange={(e) => update(faq.id, "question", e.target.value)}
              placeholder="Question..."
            />
          </Field>
          <Field label="Answer">
            <textarea
              style={{ ...S.input, ...S.textarea }}
              value={faq.answer}
              onChange={(e) => update(faq.id, "answer", e.target.value)}
              placeholder="Answer..."
            />
          </Field>
        </Card>
      ))}
    </Section>
  );
}

function StepsTab({ content, setContent, saving, save }: TabProps) {
  const steps = content.steps;

  const update = useCallback(
    (id: string, field: keyof Step, val: string) => {
      setContent((current) => ({
        ...current,
        steps: current.steps.map((step) =>
          step.id === id ? { ...step, [field]: val } : step,
        ),
      }));
    },
    [setContent],
  );

  const add = () => {
    const n = String(steps.length + 1).padStart(2, "0");
    setContent((current) => ({
      ...current,
      steps: [...current.steps, { id: uid(), n, title: "", desc: "" }],
    }));
  };

  const del = (id: string) =>
    setContent((current) => ({
      ...current,
      steps: current.steps.filter((step) => step.id !== id),
    }));

  return (
    <Section
      title="How It Works Steps"
      count={steps.length}
      saving={saving}
      sectionKey="steps"
      onSave={() => save("steps")}
      onAdd={add}
    >
      {steps.map((step) => (
        <Card key={step.id} onDelete={() => del(step.id)}>
          <div style={S.row3}>
            <Field label="Step No.">
              <input
                style={S.input}
                value={step.n}
                onChange={(e) => update(step.id, "n", e.target.value)}
                placeholder="01"
              />
            </Field>
            <div style={{ flex: 3 }}>
              <Field label="Title">
                <input
                  style={S.input}
                  value={step.title}
                  onChange={(e) => update(step.id, "title", e.target.value)}
                  placeholder="Step title..."
                />
              </Field>
            </div>
          </div>
          <Field label="Description">
            <textarea
              style={{ ...S.input, ...S.textarea }}
              value={step.desc}
              onChange={(e) => update(step.id, "desc", e.target.value)}
              placeholder="Step description..."
            />
          </Field>
        </Card>
      ))}
    </Section>
  );
}

function ProjectsTab({
  content,
  setContent,
  saving,
  save,
  showToast,
}: TabProps) {
  const projects = content.projects;
  const [folderInput, setFolderInput] = useState(DEFAULT_PROJECT_MEDIA_FOLDER);
  const [galleryFolder, setGalleryFolder] = useState(
    DEFAULT_PROJECT_MEDIA_FOLDER,
  );
  const [mediaAssets, setMediaAssets] = useState<AdminMediaAsset[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState("");
  const [pickerSlot, setPickerSlot] = useState<string | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);

  const refreshGallery = useCallback(async (folder: string) => {
    setGalleryLoading(true);
    setGalleryError("");

    try {
      const res = await fetch(
        `/api/admin/media?folder=${encodeURIComponent(folder)}`,
        {
          cache: "no-store",
        },
      );
      const data = (await res.json()) as Partial<AdminMediaListResponse> & {
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error ?? "Unable to load media library.");
      }

      setMediaAssets(Array.isArray(data.assets) ? data.assets : []);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load media library.";
      setGalleryError(message);
    } finally {
      setGalleryLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshGallery(galleryFolder);
  }, [galleryFolder, refreshGallery]);

  const updateField = useCallback(
    (
      id: string,
      field: "kicker" | "title" | "description" | "scope" | "outcome",
      val: string,
    ) => {
      setContent((current) => ({
        ...current,
        projects: current.projects.map((project) =>
          project.id === id ? { ...project, [field]: val } : project,
        ),
      }));
    },
    [setContent],
  );

  const updateTags = useCallback(
    (id: string, val: string) => {
      setContent((current) => ({
        ...current,
        projects: current.projects.map((project) =>
          project.id === id ? { ...project, tags: parseTags(val) } : project,
        ),
      }));
    },
    [setContent],
  );

  const updateImage = useCallback(
    (id: string, imageIndex: number, field: "src" | "alt", val: string) => {
      setContent((current) => ({
        ...current,
        projects: current.projects.map((project) =>
          project.id === id
            ? {
                ...project,
                images: project.images.map((image, index) =>
                  index === imageIndex ? { ...image, [field]: val } : image,
                ),
              }
            : project,
        ),
      }));
    },
    [setContent],
  );

  const assignGalleryImage = useCallback(
    (projectId: string, imageIndex: number, asset: AdminMediaAsset) => {
      setContent((current) => ({
        ...current,
        projects: current.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                images: project.images.map((image, index) =>
                  index === imageIndex
                    ? {
                        ...image,
                        src: asset.url,
                        alt:
                          image.alt.trim() ||
                          `${project.title || "Project"} - ${formatAssetName(asset)}`,
                      }
                    : image,
                ),
              }
            : project,
        ),
      }));
      setPickerSlot(null);
      showToast("Image selected from gallery.", true);
    },
    [setContent, showToast],
  );

  const uploadImage = useCallback(
    async (projectId: string, imageIndex: number, file: File) => {
      const slotKey = getImageSlotKey(projectId, imageIndex);
      setUploadingSlot(slotKey);

      try {
        const form = new FormData();
        form.set("file", file);
        form.set("folder", galleryFolder);

        const res = await fetch("/api/admin/media", {
          method: "POST",
          body: form,
        });
        const data = (await res.json()) as Partial<AdminMediaUploadResponse> & {
          error?: string;
        };

        if (!res.ok) {
          throw new Error(data.error ?? "Unable to upload image.");
        }

        if (!data.asset) {
          throw new Error("Upload completed without a usable image response.");
        }

        const uploadedAsset = data.asset;

        setMediaAssets((current) => {
          const next = current.filter(
            (asset) => asset.assetId !== uploadedAsset.assetId,
          );

          return [uploadedAsset, ...next];
        });

        setContent((current) => ({
          ...current,
          projects: current.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  images: project.images.map((image, index) =>
                    index === imageIndex
                      ? {
                          ...image,
                          src: uploadedAsset.url,
                          alt:
                            image.alt.trim() ||
                            `${project.title || "Project"} - ${formatAssetName(uploadedAsset)}`,
                        }
                      : image,
                  ),
                }
              : project,
          ),
        }));

        setPickerSlot(null);
        showToast(`Uploaded to ${galleryFolder}.`, true);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to upload image.";
        showToast(message, false);
      } finally {
        setUploadingSlot(null);
      }
    },
    [galleryFolder, setContent, showToast],
  );

  const handleFileChange = useCallback(
    async (
      projectId: string,
      imageIndex: number,
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;

      await uploadImage(projectId, imageIndex, file);
    },
    [uploadImage],
  );

  const addImage = useCallback(
    (id: string) => {
      setContent((current) => ({
        ...current,
        projects: current.projects.map((project) =>
          project.id === id
            ? {
                ...project,
                images: [...project.images, { src: "", alt: "" }],
              }
            : project,
        ),
      }));
    },
    [setContent],
  );

  const deleteImage = useCallback(
    (id: string, imageIndex: number) => {
      setContent((current) => ({
        ...current,
        projects: current.projects.map((project) =>
          project.id === id
            ? {
                ...project,
                images:
                  project.images.length > 1
                    ? project.images.filter((_, index) => index !== imageIndex)
                    : [{ src: "", alt: "" }],
              }
            : project,
        ),
      }));
    },
    [setContent],
  );

  const loadFolder = useCallback(() => {
    const nextFolder = normalizeMediaFolder(folderInput);
    setFolderInput(nextFolder);
    setGalleryFolder(nextFolder);
    setPickerSlot(null);
  }, [folderInput]);

  const add = () =>
    setContent((current) => ({
      ...current,
      projects: [...current.projects, emptyProject()],
    }));

  const del = (id: string) =>
    setContent((current) => ({
      ...current,
      projects: current.projects.filter((project) => project.id !== id),
    }));

  return (
    <Section
      title="Project Journal"
      count={projects.length}
      saving={saving}
      sectionKey="projects"
      onSave={() => save("projects")}
      onAdd={add}
    >
      <div style={S.libraryPanel}>
        <div>
          <p style={S.projectMediaTitle}>Project Image Gallery</p>
          <p style={S.projectMediaHint}>
            Choose the Cloudinary folder to browse. New uploads go into the
            active folder and appear in the picker below.
          </p>
        </div>

        <div style={S.libraryControls}>
          <div style={S.libraryFolderField}>
            <label style={S.fieldLabel}>Cloudinary Folder</label>
            <input
              style={S.input}
              value={folderInput}
              onChange={(e) => setFolderInput(e.target.value)}
              placeholder={DEFAULT_PROJECT_MEDIA_FOLDER}
            />
          </div>

          <div style={S.libraryButtons}>
            <button
              type="button"
              onClick={loadFolder}
              style={S.btnSecondaryInline}
            >
              Load Folder
            </button>
            <button
              type="button"
              onClick={() => void refreshGallery(galleryFolder)}
              style={S.btnSecondaryInline}
            >
              Refresh Gallery
            </button>
          </div>
        </div>

        <div style={S.libraryStatusRow}>
          <span style={S.libraryCount}>
            {galleryLoading ? "Loading..." : `${mediaAssets.length} images ready`}
          </span>
          <code style={S.libraryFolderPill}>{galleryFolder}</code>
        </div>

        {galleryError ? <p style={S.libraryError}>{galleryError}</p> : null}
      </div>

      {projects.map((project, projectIndex) => (
        <Card key={project.id} onDelete={() => del(project.id)}>
          <p style={S.cardIdx}>Project {projectIndex + 1}</p>

          <div style={S.row2}>
            <Field label="Kicker">
              <input
                style={S.input}
                value={project.kicker}
                onChange={(e) =>
                  updateField(project.id, "kicker", e.target.value)
                }
                placeholder="e.g. Strip-Out"
              />
            </Field>
            <Field label="Title">
              <input
                style={S.input}
                value={project.title}
                onChange={(e) =>
                  updateField(project.id, "title", e.target.value)
                }
                placeholder="Project title..."
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              style={{ ...S.input, ...S.textarea }}
              value={project.description}
              onChange={(e) =>
                updateField(project.id, "description", e.target.value)
              }
              placeholder="Describe the project story..."
            />
          </Field>

          <div style={S.row2}>
            <Field label="Scope">
              <input
                style={S.input}
                value={project.scope}
                onChange={(e) =>
                  updateField(project.id, "scope", e.target.value)
                }
                placeholder="e.g. Ceiling and lighting"
              />
            </Field>
            <Field label="Outcome">
              <input
                style={S.input}
                value={project.outcome}
                onChange={(e) =>
                  updateField(project.id, "outcome", e.target.value)
                }
                placeholder="e.g. Finished living space"
              />
            </Field>
          </div>

          <Field label="Tags">
            <input
              style={S.input}
              value={tagsToString(project.tags)}
              onChange={(e) => updateTags(project.id, e.target.value)}
              placeholder="Comma-separated tags"
            />
          </Field>

          <div style={S.projectMediaWrap}>
            <div style={S.projectMediaHead}>
              <div>
                <p style={S.projectMediaTitle}>Gallery Images</p>
                <p style={S.projectMediaHint}>
                  Upload directly into <code>{galleryFolder}</code> or choose
                  from the current gallery.
                </p>
              </div>
              <button
                type="button"
                onClick={() => addImage(project.id)}
                style={S.btnSecondaryInline}
              >
                + Add Image
              </button>
            </div>

            {project.images.map((image, imageIndex) => {
              const slotKey = getImageSlotKey(project.id, imageIndex);
              const uploadId = `project-upload-${project.id}-${imageIndex}`;
              const pickerOpen = pickerSlot === slotKey;
              const isUploading = uploadingSlot === slotKey;

              return (
                <div
                  key={`${project.id}-${imageIndex}`}
                  style={S.projectMediaCard}
                >
                  <div style={S.projectMediaCardHead}>
                    <span style={S.projectMediaCardTitle}>
                      Image {imageIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteImage(project.id, imageIndex)}
                      style={S.btnDeleteInline}
                    >
                      Remove
                    </button>
                  </div>

                  <ImagePreview
                    src={image.src}
                    alt={image.alt}
                    label={`${project.title || "Project"} image ${imageIndex + 1}`}
                  />

                  <div style={S.projectMediaActions}>
                    <label htmlFor={uploadId} style={S.btnPrimaryInline}>
                      {isUploading ? "Uploading..." : "Upload New"}
                    </label>
                    <input
                      id={uploadId}
                      type="file"
                      accept="image/*"
                      style={S.fileInput}
                      onChange={(event) =>
                        void handleFileChange(project.id, imageIndex, event)
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setPickerSlot((current) =>
                          current === slotKey ? null : slotKey,
                        )
                      }
                      style={S.btnSecondaryInline}
                    >
                      {pickerOpen ? "Hide Gallery" : "Choose From Gallery"}
                    </button>
                  </div>

                  <Field label="Image path or URL">
                    <input
                      style={S.input}
                      value={image.src}
                      onChange={(e) =>
                        updateImage(project.id, imageIndex, "src", e.target.value)
                      }
                      placeholder="https://res.cloudinary.com/... or /work/..."
                    />
                  </Field>

                  <Field label="Alt text">
                    <input
                      style={S.input}
                      value={image.alt}
                      onChange={(e) =>
                        updateImage(project.id, imageIndex, "alt", e.target.value)
                      }
                      placeholder="Describe the image for accessibility"
                    />
                  </Field>

                  {pickerOpen ? (
                    <div style={S.galleryPicker}>
                      <div style={S.galleryPickerHead}>
                        <div>
                          <p style={S.projectMediaTitle}>Choose From Gallery</p>
                          <p style={S.projectMediaHint}>
                            Showing images from <code>{galleryFolder}</code>.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void refreshGallery(galleryFolder)}
                          style={S.btnSecondaryInline}
                        >
                          Refresh
                        </button>
                      </div>

                      {galleryLoading ? (
                        <p style={S.galleryMessage}>Loading images...</p>
                      ) : mediaAssets.length === 0 ? (
                        <p style={S.galleryMessage}>
                          No images found in this folder yet. Upload a new one
                          to start the gallery.
                        </p>
                      ) : (
                        <div style={S.galleryGrid}>
                          {mediaAssets.map((asset) => {
                            const active = asset.url === image.src;

                            return (
                              <button
                                key={asset.assetId}
                                type="button"
                                onClick={() =>
                                  assignGalleryImage(project.id, imageIndex, asset)
                                }
                                style={{
                                  ...S.galleryTile,
                                  ...(active ? S.galleryTileActive : {}),
                                }}
                              >
                                <div style={S.galleryTileImageWrap}>
                                  <img
                                    src={asset.thumbnailUrl}
                                    alt={formatAssetName(asset)}
                                    style={S.galleryTileImage}
                                  />
                                </div>
                                <span style={S.galleryTileTitle}>
                                  {formatAssetName(asset)}
                                </span>
                                <span style={S.galleryTileMeta}>
                                  {asset.width}x{asset.height} · {formatBytes(asset.bytes)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </Section>
  );
}

function ProjectsManagerTab({
  content,
  setContent,
  saving,
  save,
  showToast,
}: TabProps) {
  const projects = content.projects;
  const [pickerSlot, setPickerSlot] = useState<string | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const {
    folderInput,
    galleryError,
    galleryFolder,
    galleryLoading,
    galleryLoadingMore,
    loadFolder,
    loadMore,
    mediaAssets,
    nextCursor,
    refreshGallery,
    setFolderInput,
    uploadFiles,
  } = useMediaLibrary(showToast);

  const updateField = useCallback(
    (
      id: string,
      field: "kicker" | "title" | "description" | "scope" | "outcome",
      val: string,
    ) => {
      setContent((current) => ({
        ...current,
        projects: current.projects.map((project) =>
          project.id === id ? { ...project, [field]: val } : project,
        ),
      }));
    },
    [setContent],
  );

  const updateTags = useCallback(
    (id: string, val: string) => {
      setContent((current) => ({
        ...current,
        projects: current.projects.map((project) =>
          project.id === id ? { ...project, tags: parseTags(val) } : project,
        ),
      }));
    },
    [setContent],
  );

  const updateImage = useCallback(
    (id: string, imageIndex: number, field: "src" | "alt", val: string) => {
      setContent((current) => ({
        ...current,
        projects: current.projects.map((project) =>
          project.id === id
            ? {
                ...project,
                images: project.images.map((image, index) =>
                  index === imageIndex ? { ...image, [field]: val } : image,
                ),
              }
            : project,
        ),
      }));
    },
    [setContent],
  );

  const assignGalleryImage = useCallback(
    (projectId: string, imageIndex: number, asset: AdminMediaAsset) => {
      setContent((current) => ({
        ...current,
        projects: current.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                images: project.images.map((image, index) =>
                  index === imageIndex
                    ? {
                        ...image,
                        src: asset.url,
                        alt:
                          image.alt.trim() ||
                          `${project.title || "Project"} - ${formatAssetName(asset)}`,
                      }
                    : image,
                ),
              }
            : project,
        ),
      }));
      setPickerSlot(null);
      showToast("Image selected from gallery.", true);
    },
    [setContent, showToast],
  );

  const uploadImage = useCallback(
    async (projectId: string, imageIndex: number, file: File) => {
      const slotKey = getImageSlotKey(projectId, imageIndex);
      setUploadingSlot(slotKey);

      try {
        const [uploadedAsset] = await uploadFiles([file]);
        if (!uploadedAsset) {
          throw new Error("Upload completed without a usable image response.");
        }

        setContent((current) => ({
          ...current,
          projects: current.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  images: project.images.map((image, index) =>
                    index === imageIndex
                      ? {
                          ...image,
                          src: uploadedAsset.url,
                          alt:
                            image.alt.trim() ||
                            `${project.title || "Project"} - ${formatAssetName(uploadedAsset)}`,
                        }
                      : image,
                  ),
                }
              : project,
          ),
        }));

        setPickerSlot(null);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to upload image.";
        showToast(message, false);
      } finally {
        setUploadingSlot(null);
      }
    },
    [setContent, showToast, uploadFiles],
  );

  const handleFileChange = useCallback(
    async (
      projectId: string,
      imageIndex: number,
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;

      await uploadImage(projectId, imageIndex, file);
    },
    [uploadImage],
  );

  const addImage = useCallback(
    (id: string) => {
      setContent((current) => ({
        ...current,
        projects: current.projects.map((project) =>
          project.id === id
            ? {
                ...project,
                images: [...project.images, { src: "", alt: "" }],
              }
            : project,
        ),
      }));
    },
    [setContent],
  );

  const deleteImage = useCallback(
    (id: string, imageIndex: number) => {
      setContent((current) => ({
        ...current,
        projects: current.projects.map((project) =>
          project.id === id
            ? {
                ...project,
                images:
                  project.images.length > 1
                    ? project.images.filter((_, index) => index !== imageIndex)
                    : [{ src: "", alt: "" }],
              }
            : project,
        ),
      }));
    },
    [setContent],
  );

  const add = () =>
    setContent((current) => ({
      ...current,
      projects: [...current.projects, emptyProject()],
    }));

  const del = (id: string) =>
    setContent((current) => ({
      ...current,
      projects: current.projects.filter((project) => project.id !== id),
    }));

  return (
    <Section
      title="Project Journal"
      count={projects.length}
      saving={saving}
      sectionKey="projects"
      onSave={() => save("projects")}
      onAdd={add}
    >
      <div style={S.libraryPanel}>
        <div>
          <p style={S.projectMediaTitle}>Project Image Gallery</p>
          <p style={S.projectMediaHint}>
            Browse lighter Cloudinary thumbnails here, then attach them to a
            project slot when you need them.
          </p>
        </div>

        <div style={S.libraryControls}>
          <div style={S.libraryFolderField}>
            <label style={S.fieldLabel}>Cloudinary Folder</label>
            <input
              style={S.input}
              value={folderInput}
              onChange={(e) => setFolderInput(e.target.value)}
              placeholder={DEFAULT_PROJECT_MEDIA_FOLDER}
            />
          </div>

          <div style={S.libraryButtons}>
            <button
              type="button"
              onClick={loadFolder}
              style={S.btnSecondaryInline}
            >
              Load Folder
            </button>
            <button
              type="button"
              onClick={() => void refreshGallery()}
              style={S.btnSecondaryInline}
            >
              Refresh Gallery
            </button>
          </div>
        </div>

        <div style={S.libraryStatusRow}>
          <span style={S.libraryCount}>
            {galleryLoading ? "Loading..." : `${mediaAssets.length} images loaded`}
          </span>
          <code style={S.libraryFolderPill}>{galleryFolder}</code>
          {nextCursor ? <span style={S.libraryMeta}>More images available</span> : null}
        </div>

        {galleryError ? <p style={S.libraryError}>{galleryError}</p> : null}
      </div>

      {projects.map((project, projectIndex) => (
        <Card key={project.id} onDelete={() => del(project.id)}>
          <p style={S.cardIdx}>Project {projectIndex + 1}</p>

          <div style={S.row2}>
            <Field label="Kicker">
              <input
                style={S.input}
                value={project.kicker}
                onChange={(e) =>
                  updateField(project.id, "kicker", e.target.value)
                }
                placeholder="e.g. Strip-Out"
              />
            </Field>
            <Field label="Title">
              <input
                style={S.input}
                value={project.title}
                onChange={(e) =>
                  updateField(project.id, "title", e.target.value)
                }
                placeholder="Project title..."
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              style={{ ...S.input, ...S.textarea }}
              value={project.description}
              onChange={(e) =>
                updateField(project.id, "description", e.target.value)
              }
              placeholder="Describe the project story..."
            />
          </Field>

          <div style={S.row2}>
            <Field label="Scope">
              <input
                style={S.input}
                value={project.scope}
                onChange={(e) =>
                  updateField(project.id, "scope", e.target.value)
                }
                placeholder="e.g. Ceiling and lighting"
              />
            </Field>
            <Field label="Outcome">
              <input
                style={S.input}
                value={project.outcome}
                onChange={(e) =>
                  updateField(project.id, "outcome", e.target.value)
                }
                placeholder="e.g. Finished living space"
              />
            </Field>
          </div>

          <Field label="Tags">
            <input
              style={S.input}
              value={tagsToString(project.tags)}
              onChange={(e) => updateTags(project.id, e.target.value)}
              placeholder="Comma-separated tags"
            />
          </Field>

          <div style={S.projectMediaWrap}>
            <div style={S.projectMediaHead}>
              <div>
                <p style={S.projectMediaTitle}>Gallery Images</p>
                <p style={S.projectMediaHint}>
                  Upload directly into <code>{galleryFolder}</code> or choose
                  from the current gallery.
                </p>
              </div>
              <button
                type="button"
                onClick={() => addImage(project.id)}
                style={S.btnSecondaryInline}
              >
                + Add Image
              </button>
            </div>

            {project.images.map((image, imageIndex) => {
              const slotKey = getImageSlotKey(project.id, imageIndex);
              const uploadId = `project-upload-${project.id}-${imageIndex}`;
              const pickerOpen = pickerSlot === slotKey;
              const isUploading = uploadingSlot === slotKey;

              return (
                <div
                  key={`${project.id}-${imageIndex}`}
                  style={S.projectMediaCard}
                >
                  <div style={S.projectMediaCardHead}>
                    <span style={S.projectMediaCardTitle}>
                      Image {imageIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteImage(project.id, imageIndex)}
                      style={S.btnDeleteInline}
                    >
                      Remove
                    </button>
                  </div>

                  <ImagePreview
                    src={image.src}
                    alt={image.alt}
                    label={`${project.title || "Project"} image ${imageIndex + 1}`}
                  />

                  <div style={S.projectMediaActions}>
                    <label htmlFor={uploadId} style={S.btnPrimaryInline}>
                      {isUploading ? "Uploading..." : "Upload New"}
                    </label>
                    <input
                      id={uploadId}
                      type="file"
                      accept="image/*"
                      style={S.fileInput}
                      onChange={(event) =>
                        void handleFileChange(project.id, imageIndex, event)
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setPickerSlot((current) =>
                          current === slotKey ? null : slotKey,
                        )
                      }
                      style={S.btnSecondaryInline}
                    >
                      {pickerOpen ? "Hide Gallery" : "Choose From Gallery"}
                    </button>
                  </div>

                  <Field label="Image path or URL">
                    <input
                      style={S.input}
                      value={image.src}
                      onChange={(e) =>
                        updateImage(project.id, imageIndex, "src", e.target.value)
                      }
                      placeholder="https://res.cloudinary.com/... or /work/..."
                    />
                  </Field>

                  <Field label="Alt text">
                    <input
                      style={S.input}
                      value={image.alt}
                      onChange={(e) =>
                        updateImage(project.id, imageIndex, "alt", e.target.value)
                      }
                      placeholder="Describe the image for accessibility"
                    />
                  </Field>

                  {pickerOpen ? (
                    <div style={S.galleryPicker}>
                      <div style={S.galleryPickerHead}>
                        <div>
                          <p style={S.projectMediaTitle}>Choose From Gallery</p>
                          <p style={S.projectMediaHint}>
                            Showing images from <code>{galleryFolder}</code>.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void refreshGallery()}
                          style={S.btnSecondaryInline}
                        >
                          Refresh
                        </button>
                      </div>

                      {galleryLoading ? (
                        <p style={S.galleryMessage}>Loading images...</p>
                      ) : mediaAssets.length === 0 ? (
                        <p style={S.galleryMessage}>
                          No images found in this folder yet. Upload a new one
                          to start the gallery.
                        </p>
                      ) : (
                        <div style={S.galleryGrid}>
                          {mediaAssets.map((asset) => {
                            const active = asset.url === image.src;

                            return (
                              <button
                                key={asset.assetId}
                                type="button"
                                onClick={() =>
                                  assignGalleryImage(project.id, imageIndex, asset)
                                }
                                style={{
                                  ...S.galleryTile,
                                  ...(active ? S.galleryTileActive : {}),
                                }}
                              >
                                <div style={S.galleryTileImageWrap}>
                                  <img
                                    src={asset.thumbnailUrl}
                                    alt={formatAssetName(asset)}
                                    style={S.galleryTileImage}
                                    loading="lazy"
                                  />
                                </div>
                                <span style={S.galleryTileTitle}>
                                  {formatAssetName(asset)}
                                </span>
                                <span style={S.galleryTileMeta}>
                                  {asset.width}x{asset.height} | {formatBytes(asset.bytes)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {nextCursor ? (
                        <div style={S.galleryFooter}>
                          <button
                            type="button"
                            onClick={() => void loadMore()}
                            disabled={galleryLoadingMore}
                            style={S.btnSecondaryInline}
                          >
                            {galleryLoadingMore ? "Loading..." : "Load More"}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </Section>
  );
}

function MediaTab({ showToast }: Pick<TabProps, "showToast">) {
  const {
    deleteAsset,
    folderInput,
    galleryError,
    galleryFolder,
    galleryLoading,
    galleryLoadingMore,
    loadFolder,
    loadMore,
    mediaAssets,
    mediaBusyId,
    nextCursor,
    refreshGallery,
    setFolderInput,
    uploadFiles,
  } = useMediaLibrary(showToast);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const handleUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      event.target.value = "";
      if (!files || files.length === 0) return;

      setUploadingMedia(true);

      try {
        await uploadFiles(files);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to upload image.";
        showToast(message, false);
      } finally {
        setUploadingMedia(false);
      }
    },
    [showToast, uploadFiles],
  );

  const copyValue = useCallback(
    async (value: string, label: string) => {
      try {
        await navigator.clipboard.writeText(value);
        showToast(`${label} copied.`, true);
      } catch {
        showToast(`Unable to copy ${label.toLowerCase()}.`, false);
      }
    },
    [showToast],
  );

  return (
    <div style={S.stack}>
      <div style={S.sectionHead}>
        <div>
          <h2 style={S.sectionTitle}>Media Library</h2>
          <p style={S.sectionCount}>
            Manage Cloudinary images without opening a project card.
          </p>
        </div>
        <label htmlFor="media-library-upload" style={S.btnPrimaryInline}>
          {uploadingMedia ? "Uploading..." : "Upload Images"}
        </label>
        <input
          id="media-library-upload"
          type="file"
          accept="image/*"
          multiple
          style={S.fileInput}
          onChange={(event) => void handleUpload(event)}
        />
      </div>

      <div style={S.libraryPanel}>
        <div>
          <p style={S.projectMediaTitle}>Cloudinary Folders</p>
          <p style={S.projectMediaHint}>
            Pick a folder, refresh it, then manage images with lighter
            thumbnails instead of loading full originals in the admin.
          </p>
        </div>

        <div style={S.libraryControls}>
          <div style={S.libraryFolderField}>
            <label style={S.fieldLabel}>Cloudinary Folder</label>
            <input
              style={S.input}
              value={folderInput}
              onChange={(e) => setFolderInput(e.target.value)}
              placeholder={DEFAULT_PROJECT_MEDIA_FOLDER}
            />
          </div>

          <div style={S.libraryButtons}>
            <button
              type="button"
              onClick={loadFolder}
              style={S.btnSecondaryInline}
            >
              Load Folder
            </button>
            <button
              type="button"
              onClick={() => void refreshGallery()}
              style={S.btnSecondaryInline}
            >
              Refresh Gallery
            </button>
          </div>
        </div>

        <div style={S.libraryStatusRow}>
          <span style={S.libraryCount}>
            {galleryLoading ? "Loading..." : `${mediaAssets.length} images loaded`}
          </span>
          <code style={S.libraryFolderPill}>{galleryFolder}</code>
          {nextCursor ? <span style={S.libraryMeta}>More images available</span> : null}
        </div>

        {galleryError ? <p style={S.libraryError}>{galleryError}</p> : null}
      </div>

      {galleryLoading && mediaAssets.length === 0 ? (
        <p style={S.galleryMessage}>Loading media...</p>
      ) : mediaAssets.length === 0 ? (
        <div style={S.mediaEmptyState}>
          <strong>No images yet</strong>
          <span>
            Upload into <code>{galleryFolder}</code> to build your media library.
          </span>
        </div>
      ) : (
        <div style={S.mediaManagerGrid}>
          {mediaAssets.map((asset) => (
            <div key={asset.assetId} style={S.mediaManagerCard}>
              <div style={S.mediaManagerThumbWrap}>
                <img
                  src={asset.thumbnailUrl}
                  alt={formatAssetName(asset)}
                  style={S.mediaManagerThumb}
                  loading="lazy"
                />
              </div>

              <div style={S.mediaManagerBody}>
                <strong style={S.mediaManagerTitle}>{formatAssetName(asset)}</strong>
                <span style={S.mediaManagerMeta}>
                  {asset.width}x{asset.height} | {formatBytes(asset.bytes)}
                </span>
                <span style={S.mediaManagerMeta}>
                  {asset.format.toUpperCase()} | {asset.folder}
                </span>
              </div>

              <div style={S.mediaManagerActions}>
                <button
                  type="button"
                  onClick={() => void copyValue(asset.url, "Image URL")}
                  style={S.btnSecondaryInline}
                >
                  Copy URL
                </button>
                <button
                  type="button"
                  onClick={() => void copyValue(asset.publicId, "Public ID")}
                  style={S.btnSecondaryInline}
                >
                  Copy Public ID
                </button>
                <button
                  type="button"
                  onClick={() => void deleteAsset(asset)}
                  disabled={mediaBusyId === asset.assetId}
                  style={S.btnDeleteInline}
                >
                  {mediaBusyId === asset.assetId ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {nextCursor ? (
        <div style={S.galleryFooter}>
          <button
            type="button"
            onClick={() => void loadMore()}
            disabled={galleryLoadingMore}
            style={S.btnSecondary}
          >
            {galleryLoadingMore ? "Loading..." : "Load More Images"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

interface TabProps {
  content: Content;
  setContent: Dispatch<SetStateAction<Content>>;
  saving: ContentKey | null;
  save: (key: ContentKey) => Promise<void>;
  showToast: (msg: string, ok: boolean) => void;
}

export default function AdminClient({ isAuthenticated, initialContent }: Props) {
  if (!isAuthenticated || !initialContent) return <LoginScreen />;
  return <Dashboard initialContent={initialContent} />;
}

const S: Record<string, CSSProperties> = {
  loginWrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f172a",
    fontFamily: "system-ui,sans-serif",
  },
  loginCard: {
    background: "#1e293b",
    borderRadius: 16,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 380,
    boxShadow: "0 20px 60px rgba(0,0,0,.5)",
  },
  loginLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: "#0d9488",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 16,
  },
  loginTitle: { margin: 0, fontSize: 22, fontWeight: 700, color: "#f1f5f9" },
  loginSub: { margin: "6px 0 0", color: "#94a3b8", fontSize: 14 },
  errMsg: { color: "#f87171", fontSize: 13, margin: "8px 0 0" },

  dashWrap: {
    minHeight: "100vh",
    background: "#0f172a",
    fontFamily: "system-ui,sans-serif",
    color: "#e2e8f0",
  },
  topBar: {
    background: "#1e293b",
    borderBottom: "1px solid #334155",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  topBarInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 24px",
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBarBrand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 700,
    fontSize: 16,
    color: "#f1f5f9",
  },
  topBarLogo: {
    background: "#0d9488",
    color: "#fff",
    borderRadius: 8,
    width: 32,
    height: 32,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 800,
  },
  tabBar: {
    background: "#1e293b",
    borderBottom: "1px solid #334155",
    display: "flex",
    gap: 4,
    padding: "0 24px",
    maxWidth: 1100,
    margin: "0 auto",
  },
  tabBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    padding: "14px 16px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    borderBottom: "2px solid transparent",
    transition: "color .15s",
  },
  tabBtnActive: { color: "#0d9488", borderBottom: "2px solid #0d9488" },

  main: { maxWidth: 1100, margin: "0 auto", padding: "32px 24px" },
  sectionHead: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 12,
  },
  sectionTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: "#f1f5f9",
  },
  sectionCount: { margin: "4px 0 0", fontSize: 13, color: "#64748b" },
  sectionActions: { display: "flex", gap: 10, flexWrap: "wrap" },
  stack: { display: "flex", flexDirection: "column", gap: 12 },
  libraryPanel: {
    background: "#111c31",
    border: "1px solid #334155",
    borderRadius: 12,
    padding: 18,
  },
  libraryControls: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 12,
    alignItems: "end",
    marginTop: 16,
  },
  libraryFolderField: {
    minWidth: 0,
  },
  libraryButtons: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  libraryStatusRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 14,
  },
  libraryCount: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: 600,
  },
  libraryMeta: {
    color: "#94a3b8",
    fontSize: 12,
  },
  libraryFolderPill: {
    padding: "5px 10px",
    borderRadius: 999,
    background: "rgba(13, 148, 136, 0.14)",
    color: "#5eead4",
    border: "1px solid rgba(45, 212, 191, 0.25)",
    fontSize: 12,
  },
  libraryError: {
    color: "#fca5a5",
    margin: "12px 0 0",
    fontSize: 13,
  },

  card: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 12,
    padding: 20,
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
  },
  cardIdx: {
    margin: "0 0 12px",
    fontSize: 12,
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  input: {
    width: "100%",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 8,
    color: "#e2e8f0",
    padding: "9px 12px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  textarea: { minHeight: 90, resize: "vertical" },
  fieldLabel: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#94a3b8",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 0,
  },
  row3: {
    display: "grid",
    gridTemplateColumns: "80px 1fr",
    gap: 12,
    marginBottom: 0,
  },
  projectMediaWrap: {
    marginTop: 8,
    borderTop: "1px solid #334155",
    paddingTop: 16,
  },
  projectMediaHead: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  projectMediaTitle: {
    margin: 0,
    color: "#f1f5f9",
    fontSize: 14,
    fontWeight: 700,
  },
  projectMediaHint: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 1.5,
  },
  projectMediaCard: {
    border: "1px solid #334155",
    borderRadius: 10,
    padding: 14,
    background: "#0f172a",
    marginBottom: 12,
  },
  projectMediaActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 14,
  },
  projectMediaCardHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  projectMediaCardTitle: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  mediaPreviewFrame: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 12,
    border: "1px solid #334155",
    background: "#020617",
    aspectRatio: "16 / 10",
    marginBottom: 14,
  },
  mediaPreviewEmpty: {
    borderRadius: 12,
    border: "1px dashed #334155",
    background: "rgba(15, 23, 42, 0.8)",
    minHeight: 180,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    color: "#94a3b8",
    fontSize: 13,
    marginBottom: 14,
    textAlign: "center",
    padding: 20,
  },
  mediaPreviewImage: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  galleryPicker: {
    borderRadius: 12,
    border: "1px solid #334155",
    background: "#111c31",
    padding: 14,
  },
  galleryPickerHead: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  galleryMessage: {
    margin: 0,
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 1.6,
  },
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 12,
  },
  galleryFooter: {
    display: "flex",
    justifyContent: "center",
    marginTop: 14,
  },
  galleryTile: {
    border: "1px solid #334155",
    borderRadius: 12,
    background: "#0f172a",
    padding: 10,
    textAlign: "left",
    cursor: "pointer",
    color: "#e2e8f0",
  },
  galleryTileActive: {
    border: "1px solid #14b8a6",
    boxShadow: "0 0 0 1px rgba(20, 184, 166, 0.3)",
  },
  galleryTileImageWrap: {
    aspectRatio: "4 / 3",
    overflow: "hidden",
    borderRadius: 10,
    background: "#020617",
    marginBottom: 10,
  },
  galleryTileImage: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  galleryTileTitle: {
    display: "block",
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.4,
  },
  galleryTileMeta: {
    display: "block",
    marginTop: 4,
    color: "#94a3b8",
    fontSize: 11,
    lineHeight: 1.4,
  },
  mediaEmptyState: {
    borderRadius: 12,
    border: "1px dashed #334155",
    background: "#111c31",
    minHeight: 220,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
    padding: 24,
  },
  mediaManagerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },
  mediaManagerCard: {
    borderRadius: 14,
    border: "1px solid #334155",
    background: "#111c31",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  mediaManagerThumbWrap: {
    aspectRatio: "4 / 3",
    background: "#020617",
    overflow: "hidden",
  },
  mediaManagerThumb: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  mediaManagerBody: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: "14px 14px 0",
  },
  mediaManagerTitle: {
    color: "#f8fafc",
    fontSize: 13,
    lineHeight: 1.4,
  },
  mediaManagerMeta: {
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 1.5,
  },
  mediaManagerActions: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    padding: 14,
    marginTop: "auto",
  },

  btnPrimary: {
    background: "#0d9488",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "9px 18px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
  },
  btnPrimaryInline: {
    background: "#0d9488",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "9px 18px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  btnSecondary: {
    background: "transparent",
    color: "#0d9488",
    border: "1px solid #0d9488",
    borderRadius: 8,
    padding: "9px 18px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  btnSecondaryInline: {
    background: "transparent",
    color: "#0d9488",
    border: "1px solid #0d9488",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  fileInput: {
    display: "none",
  },
  btnDelete: {
    background: "transparent",
    color: "#64748b",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    padding: "0 4px",
    lineHeight: 1,
    flexShrink: 0,
  },
  btnDeleteInline: {
    background: "transparent",
    color: "#f87171",
    border: "1px solid #7f1d1d",
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  btnLogout: {
    background: "transparent",
    color: "#94a3b8",
    border: "1px solid #334155",
    borderRadius: 8,
    padding: "6px 14px",
    fontSize: 13,
    cursor: "pointer",
  },
};
