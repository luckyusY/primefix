"use client";

import { useState, useCallback } from "react";
import type { Content, Review, FaqItem, Step, Project, ContentKey } from "@/lib/types";

// ─── helpers ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);

// ─── tiny toast ───────────────────────────────────────────────────────────────
function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      background: ok ? "#0d9488" : "#dc2626",
      color: "#fff", padding: "12px 20px", borderRadius: 8,
      fontFamily: "system-ui,sans-serif", fontSize: 14, fontWeight: 500,
      boxShadow: "0 4px 20px rgba(0,0,0,.35)",
    }}>
      {msg}
    </div>
  );
}

// ─── props ────────────────────────────────────────────────────────────────────
interface Props {
  isAuthenticated: boolean;
  initialContent: Content | null;
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
function LoginScreen() {
  const [pw, setPw]   = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
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
    } else {
      setErr("Incorrect password.");
    }
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
            onChange={e => setPw(e.target.value)}
            style={S.input}
            required
            autoFocus
          />
          {err && <p style={S.errMsg}>{err}</p>}
          <button type="submit" disabled={busy} style={S.btnPrimary}>
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
type Tab = "reviews" | "faqs" | "steps" | "projects";

function Dashboard({ initialContent }: { initialContent: Content }) {
  const [content, setContent] = useState<Content>(initialContent);
  const [tab, setTab]   = useState<Tab>("reviews");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [saving, setSaving] = useState<ContentKey | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
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
    } else {
      const d = await res.json();
      showToast(d.error ?? "Save failed", false);
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "reviews",  label: "Reviews" },
    { key: "faqs",     label: "FAQs" },
    { key: "steps",    label: "How It Works" },
    { key: "projects", label: "Support Types" },
  ];

  return (
    <div style={S.dashWrap}>
      {/* Top bar */}
      <header style={S.topBar}>
        <div style={S.topBarInner}>
          <span style={S.topBarBrand}>
            <span style={S.topBarLogo}>PF</span>
            PrimeFix Hub Admin
          </span>
          <button onClick={logout} style={S.btnLogout}>Log out</button>
        </div>
      </header>

      {/* Tabs */}
      <div style={S.tabBar}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{ ...S.tabBtn, ...(tab === t.key ? S.tabBtnActive : {}) }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main style={S.main}>
        {tab === "reviews"  && <ReviewsTab  content={content} setContent={setContent} saving={saving} save={save} />}
        {tab === "faqs"     && <FaqsTab     content={content} setContent={setContent} saving={saving} save={save} />}
        {tab === "steps"    && <StepsTab    content={content} setContent={setContent} saving={saving} save={save} />}
        {tab === "projects" && <ProjectsTab content={content} setContent={setContent} saving={saving} save={save} />}
      </main>

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </div>
  );
}

// ─── shared section wrapper ───────────────────────────────────────────────────
function Section({
  title, count, saving, sectionKey, onSave, onAdd, children,
}: {
  title: string; count: number; saving: ContentKey | null;
  sectionKey: ContentKey; onSave: () => void; onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div style={S.sectionHead}>
        <div>
          <h2 style={S.sectionTitle}>{title}</h2>
          <p style={S.sectionCount}>{count} item{count !== 1 ? "s" : ""}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onAdd} style={S.btnSecondary}>+ Add</button>
          <button onClick={onSave} disabled={saving === sectionKey} style={S.btnPrimary}>
            {saving === sectionKey ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

// ─── card wrapper ─────────────────────────────────────────────────────────────
function Card({ onDelete, children }: { onDelete: () => void; children: React.ReactNode }) {
  return (
    <div style={S.card}>
      <div style={{ flex: 1 }}>{children}</div>
      <button onClick={onDelete} style={S.btnDelete} title="Delete">✕</button>
    </div>
  );
}

// ─── field helpers ────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={S.fieldLabel}>{label}</label>
      {children}
    </div>
  );
}

// ─── REVIEWS TAB ─────────────────────────────────────────────────────────────
function ReviewsTab({ content, setContent, saving, save }: TabProps) {
  const reviews = content.reviews;

  const update = useCallback((id: string, field: keyof Review, val: string) => {
    setContent(c => ({
      ...c,
      reviews: c.reviews.map(r => r.id === id ? { ...r, [field]: val } : r),
    }));
  }, [setContent]);

  const add = () => setContent(c => ({
    ...c,
    reviews: [...c.reviews, { id: uid(), name: "", type: "Homeowner", text: "" }],
  }));

  const del = (id: string) => setContent(c => ({
    ...c,
    reviews: c.reviews.filter(r => r.id !== id),
  }));

  return (
    <Section title="Client Reviews" count={reviews.length} saving={saving}
      sectionKey="reviews" onSave={() => save("reviews")} onAdd={add}>
      {reviews.map(r => (
        <Card key={r.id} onDelete={() => del(r.id)}>
          <div style={S.row2}>
            <Field label="Name">
              <input style={S.input} value={r.name} onChange={e => update(r.id, "name", e.target.value)} placeholder="Client name" />
            </Field>
            <Field label="Type">
              <select style={S.input} value={r.type} onChange={e => update(r.id, "type", e.target.value)}>
                <option>Homeowner</option>
                <option>Landlord</option>
                <option>Tenant</option>
                <option>Property Manager</option>
              </select>
            </Field>
          </div>
          <Field label="Review Text">
            <textarea style={{ ...S.input, ...S.textarea }} value={r.text}
              onChange={e => update(r.id, "text", e.target.value)} placeholder="Review text…" />
          </Field>
        </Card>
      ))}
    </Section>
  );
}

// ─── FAQS TAB ─────────────────────────────────────────────────────────────────
function FaqsTab({ content, setContent, saving, save }: TabProps) {
  const faqs = content.faqs;

  const update = useCallback((id: string, field: keyof FaqItem, val: string) => {
    setContent(c => ({ ...c, faqs: c.faqs.map(f => f.id === id ? { ...f, [field]: val } : f) }));
  }, [setContent]);

  const add = () => setContent(c => ({
    ...c, faqs: [...c.faqs, { id: uid(), question: "", answer: "" }],
  }));

  const del = (id: string) => setContent(c => ({ ...c, faqs: c.faqs.filter(f => f.id !== id) }));

  return (
    <Section title="Frequently Asked Questions" count={faqs.length} saving={saving}
      sectionKey="faqs" onSave={() => save("faqs")} onAdd={add}>
      {faqs.map((f, i) => (
        <Card key={f.id} onDelete={() => del(f.id)}>
          <p style={S.cardIdx}>Question {i + 1}</p>
          <Field label="Question">
            <input style={S.input} value={f.question} onChange={e => update(f.id, "question", e.target.value)} placeholder="Question…" />
          </Field>
          <Field label="Answer">
            <textarea style={{ ...S.input, ...S.textarea }} value={f.answer}
              onChange={e => update(f.id, "answer", e.target.value)} placeholder="Answer…" />
          </Field>
        </Card>
      ))}
    </Section>
  );
}

// ─── STEPS TAB ────────────────────────────────────────────────────────────────
function StepsTab({ content, setContent, saving, save }: TabProps) {
  const steps = content.steps;

  const update = useCallback((id: string, field: keyof Step, val: string) => {
    setContent(c => ({ ...c, steps: c.steps.map(s => s.id === id ? { ...s, [field]: val } : s) }));
  }, [setContent]);

  const add = () => {
    const n = String(steps.length + 1).padStart(2, "0");
    setContent(c => ({ ...c, steps: [...c.steps, { id: uid(), n, title: "", desc: "" }] }));
  };

  const del = (id: string) => setContent(c => ({ ...c, steps: c.steps.filter(s => s.id !== id) }));

  return (
    <Section title="How It Works Steps" count={steps.length} saving={saving}
      sectionKey="steps" onSave={() => save("steps")} onAdd={add}>
      {steps.map(s => (
        <Card key={s.id} onDelete={() => del(s.id)}>
          <div style={S.row3}>
            <Field label="Step No.">
              <input style={S.input} value={s.n} onChange={e => update(s.id, "n", e.target.value)} placeholder="01" />
            </Field>
            <div style={{ flex: 3 }}>
              <Field label="Title">
                <input style={S.input} value={s.title} onChange={e => update(s.id, "title", e.target.value)} placeholder="Step title…" />
              </Field>
            </div>
          </div>
          <Field label="Description">
            <textarea style={{ ...S.input, ...S.textarea }} value={s.desc}
              onChange={e => update(s.id, "desc", e.target.value)} placeholder="Step description…" />
          </Field>
        </Card>
      ))}
    </Section>
  );
}

// ─── PROJECTS TAB ────────────────────────────────────────────────────────────
function ProjectsTab({ content, setContent, saving, save }: TabProps) {
  const projects = content.projects;

  const update = useCallback((id: string, field: keyof Project, val: string) => {
    setContent(c => ({ ...c, projects: c.projects.map(p => p.id === id ? { ...p, [field]: val } : p) }));
  }, [setContent]);

  const add = () => setContent(c => ({
    ...c, projects: [...c.projects, { id: uid(), title: "", date: "", description: "", image: "/media/home-exterior.jpg", alt: "" }],
  }));

  const del = (id: string) => setContent(c => ({ ...c, projects: c.projects.filter(p => p.id !== id) }));

  return (
    <Section title="Support Types" count={projects.length} saving={saving}
      sectionKey="projects" onSave={() => save("projects")} onAdd={add}>
      {projects.map(p => (
        <Card key={p.id} onDelete={() => del(p.id)}>
          <div style={S.row2}>
            <Field label="Title">
              <input style={S.input} value={p.title} onChange={e => update(p.id, "title", e.target.value)} placeholder="Card title…" />
            </Field>
            <Field label="Badge / Date">
              <input style={S.input} value={p.date} onChange={e => update(p.id, "date", e.target.value)} placeholder="e.g. Rapid Response" />
            </Field>
          </div>
          <Field label="Description">
            <textarea style={{ ...S.input, ...S.textarea }} value={p.description}
              onChange={e => update(p.id, "description", e.target.value)} placeholder="Card description…" />
          </Field>
          <div style={S.row2}>
            <Field label="Image path">
              <input style={S.input} value={p.image} onChange={e => update(p.id, "image", e.target.value)} placeholder="/media/home-exterior.jpg" />
            </Field>
            <Field label="Alt text">
              <input style={S.input} value={p.alt} onChange={e => update(p.id, "alt", e.target.value)} placeholder="Image description…" />
            </Field>
          </div>
        </Card>
      ))}
    </Section>
  );
}

// ─── types shared by tab components ──────────────────────────────────────────
interface TabProps {
  content: Content;
  setContent: React.Dispatch<React.SetStateAction<Content>>;
  saving: ContentKey | null;
  save: (key: ContentKey) => Promise<void>;
}

// ─── ROOT EXPORT ─────────────────────────────────────────────────────────────
export default function AdminClient({ isAuthenticated, initialContent }: Props) {
  if (!isAuthenticated || !initialContent) return <LoginScreen />;
  return <Dashboard initialContent={initialContent} />;
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  // login
  loginWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", fontFamily: "system-ui,sans-serif" },
  loginCard: { background: "#1e293b", borderRadius: 16, padding: "40px 36px", width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,.5)" },
  loginLogo: { width: 48, height: 48, borderRadius: 12, background: "#0d9488", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, marginBottom: 16 },
  loginTitle: { margin: 0, fontSize: 22, fontWeight: 700, color: "#f1f5f9" },
  loginSub:  { margin: "6px 0 0", color: "#94a3b8", fontSize: 14 },
  errMsg:    { color: "#f87171", fontSize: 13, margin: "8px 0 0" },

  // dashboard
  dashWrap: { minHeight: "100vh", background: "#0f172a", fontFamily: "system-ui,sans-serif", color: "#e2e8f0" },
  topBar:   { background: "#1e293b", borderBottom: "1px solid #334155", position: "sticky", top: 0, zIndex: 100 },
  topBarInner: { maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" },
  topBarBrand: { display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 16, color: "#f1f5f9" },
  topBarLogo: { background: "#0d9488", color: "#fff", borderRadius: 8, width: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 },

  tabBar: { background: "#1e293b", borderBottom: "1px solid #334155", display: "flex", gap: 4, padding: "0 24px", maxWidth: 1100, margin: "0 auto" },
  tabBtn: { background: "none", border: "none", color: "#94a3b8", padding: "14px 16px", fontSize: 14, fontWeight: 500, cursor: "pointer", borderBottom: "2px solid transparent", transition: "color .15s" },
  tabBtnActive: { color: "#0d9488", borderBottom: "2px solid #0d9488" },

  main: { maxWidth: 1100, margin: "0 auto", padding: "32px 24px" },

  // section
  sectionHead: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 },
  sectionTitle: { margin: 0, fontSize: 20, fontWeight: 700, color: "#f1f5f9" },
  sectionCount: { margin: "4px 0 0", fontSize: 13, color: "#64748b" },

  // card
  card: { background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "20px 20px 20px 20px", display: "flex", gap: 16, alignItems: "flex-start" },
  cardIdx: { margin: "0 0 12px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" },

  // form elements
  input: { width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0", padding: "9px 12px", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  textarea: { minHeight: 90, resize: "vertical" },
  fieldLabel: { display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" },

  // layout helpers
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 0 },
  row3: { display: "grid", gridTemplateColumns: "80px 1fr", gap: 12, marginBottom: 0 },

  // buttons
  btnPrimary:   { background: "#0d9488", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%" },
  btnSecondary: { background: "transparent", color: "#0d9488", border: "1px solid #0d9488", borderRadius: 8, padding: "9px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  btnDelete:    { background: "transparent", color: "#64748b", border: "none", fontSize: 18, cursor: "pointer", padding: "0 4px", lineHeight: 1, flexShrink: 0 },
  btnLogout:    { background: "transparent", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer" },
};
