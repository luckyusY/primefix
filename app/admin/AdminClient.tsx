"use client";

import { useCallback, useState } from "react";
import type {
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

type Tab = "reviews" | "faqs" | "steps" | "projects";

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
          />
        ) : null}
        {tab === "faqs" ? (
          <FaqsTab
            content={content}
            setContent={setContent}
            saving={saving}
            save={save}
          />
        ) : null}
        {tab === "steps" ? (
          <StepsTab
            content={content}
            setContent={setContent}
            saving={saving}
            save={save}
          />
        ) : null}
        {tab === "projects" ? (
          <ProjectsTab
            content={content}
            setContent={setContent}
            saving={saving}
            save={save}
          />
        ) : null}
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

function ProjectsTab({ content, setContent, saving, save }: TabProps) {
  const projects = content.projects;

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
                  Use local paths like `/work/...` or Cloudinary image URLs.
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

            {project.images.map((image, imageIndex) => (
              <div key={`${project.id}-${imageIndex}`} style={S.projectMediaCard}>
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

                <Field label="Image path or URL">
                  <input
                    style={S.input}
                    value={image.src}
                    onChange={(e) =>
                      updateImage(project.id, imageIndex, "src", e.target.value)
                    }
                    placeholder="/work/house1/example.jpg"
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
              </div>
            ))}
          </div>
        </Card>
      ))}
    </Section>
  );
}

interface TabProps {
  content: Content;
  setContent: Dispatch<SetStateAction<Content>>;
  saving: ContentKey | null;
  save: (key: ContentKey) => Promise<void>;
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
