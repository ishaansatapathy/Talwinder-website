import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Search,
  Sun,
  Moon,
  ChevronRight,
  Copy,
  Check,
  Zap,
  BookOpen,
  X,
} from "lucide-react";

/* ────────────────────────────────────────────────────
   DATA — every Talwinder utility, grouped by section
   ──────────────────────────────────────────────────── */

type UtilityDef = {
  cls: string;
  css: string;
  desc: string;
  preview?: React.CSSProperties;
};

type DocSection = {
  id: string;
  title: string;
  intro: string;
  utilities: UtilityDef[];
};

const SECTIONS: DocSection[] = [
  {
    id: "spacing",
    title: "Spacing",
    intro:
      "Spacing utilities control padding and margin. The number value is multiplied by 4 to produce the final pixel value.",
    utilities: [
      { cls: "tw-p-4", css: "padding: 16px", desc: "Padding on all sides. Value × 4.", preview: { padding: "16px", background: "#e0e7ff", borderRadius: 6 } },
      { cls: "tw-px-6", css: "padding-left: 24px; padding-right: 24px", desc: "Horizontal padding only.", preview: { paddingLeft: "24px", paddingRight: "24px", background: "#e0e7ff", borderRadius: 6 } },
      { cls: "tw-py-8", css: "padding-top: 32px; padding-bottom: 32px", desc: "Vertical padding only.", preview: { paddingTop: "32px", paddingBottom: "32px", background: "#e0e7ff", borderRadius: 6 } },
      { cls: "tw-m-2", css: "margin: 8px", desc: "Margin on all sides. Value × 4.", preview: { margin: "8px", background: "#e0e7ff", borderRadius: 6 } },
    ],
  },
  {
    id: "layout",
    title: "Layout",
    intro:
      "Layout utilities handle flexbox display, direction, alignment, and distribution of elements.",
    utilities: [
      { cls: "tw-flex", css: "display: flex", desc: "Sets element to flex container." },
      { cls: "tw-flex-row", css: "display: flex; flex-direction: row", desc: "Flex container with horizontal direction." },
      { cls: "tw-flex-col", css: "display: flex; flex-direction: column", desc: "Flex container with vertical direction." },
      { cls: "tw-flex-center", css: "display: flex; justify-content: center; align-items: center", desc: "Centers children both horizontally and vertically." },
      { cls: "tw-justify-center", css: "justify-content: center", desc: "Centers children along the main axis." },
      { cls: "tw-justify-between", css: "justify-content: space-between", desc: "Distributes children with space between." },
      { cls: "tw-items-center", css: "align-items: center", desc: "Centers children along the cross axis." },
    ],
  },
  {
    id: "color",
    title: "Color",
    intro:
      "Color utilities apply background and text colors. Any CSS color name or value can be used after the prefix.",
    utilities: [
      { cls: "tw-bg-black", css: "background-color: black", desc: "Sets background to the named color.", preview: { backgroundColor: "black", color: "white", padding: "12px 16px", borderRadius: 6 } },
      { cls: "tw-bg-blue", css: "background-color: blue", desc: "Sets background to blue.", preview: { backgroundColor: "blue", color: "white", padding: "12px 16px", borderRadius: 6 } },
      { cls: "tw-bg-yellow", css: "background-color: yellow", desc: "Sets background to yellow.", preview: { backgroundColor: "yellow", color: "#333", padding: "12px 16px", borderRadius: 6 } },
      { cls: "tw-text-white", css: "color: white", desc: "Sets text color when value is non-numeric.", preview: { color: "white", backgroundColor: "#1b1b1b", padding: "12px 16px", borderRadius: 6 } },
      { cls: "tw-text-red", css: "color: red", desc: "Sets text color to red.", preview: { color: "red", padding: "12px 16px", borderRadius: 6 } },
    ],
  },
  {
    id: "typography",
    title: "Typography",
    intro:
      "Typography utilities control font size, weight, and alignment. Numeric text values set font-size in pixels.",
    utilities: [
      { cls: "tw-text-14", css: "font-size: 14px", desc: "Sets font-size to 14px (numeric value = pixel size).", preview: { fontSize: "14px" } },
      { cls: "tw-text-28", css: "font-size: 28px", desc: "Sets font-size to 28px.", preview: { fontSize: "28px", fontWeight: 600 } },
      { cls: "tw-text-bold", css: "font-weight: bold", desc: "Makes text bold.", preview: { fontWeight: "bold" } },
      { cls: "tw-text-center", css: "text-align: center", desc: "Centers text horizontally.", preview: { textAlign: "center" as const } },
    ],
  },
  {
    id: "sizing",
    title: "Sizing",
    intro:
      "Sizing utilities set fixed width and height in pixels.",
    utilities: [
      { cls: "tw-w-100", css: "width: 100px", desc: "Sets width to 100px.", preview: { width: "100px", height: "40px", background: "#dbeafe", borderRadius: 6 } },
      { cls: "tw-w-200", css: "width: 200px", desc: "Sets width to 200px.", preview: { width: "200px", height: "40px", background: "#dbeafe", borderRadius: 6 } },
      { cls: "tw-h-100", css: "height: 100px", desc: "Sets height to 100px.", preview: { width: "60px", height: "100px", background: "#dbeafe", borderRadius: 6 } },
      { cls: "tw-h-50", css: "height: 50px", desc: "Sets height to 50px.", preview: { width: "60px", height: "50px", background: "#dbeafe", borderRadius: 6 } },
    ],
  },
  {
    id: "position",
    title: "Position",
    intro:
      "Position utilities control CSS positioning and offset values.",
    utilities: [
      { cls: "tw-relative", css: "position: relative", desc: "Sets element positioning to relative." },
      { cls: "tw-absolute", css: "position: absolute", desc: "Sets element positioning to absolute." },
      { cls: "tw-fixed", css: "position: fixed", desc: "Sets element positioning to fixed." },
      { cls: "tw-top-10", css: "top: 10px", desc: "Sets top offset to 10px." },
      { cls: "tw-left-20", css: "left: 20px", desc: "Sets left offset to 20px." },
      { cls: "tw-bottom-0", css: "bottom: 0px", desc: "Sets bottom offset to 0px." },
      { cls: "tw-right-0", css: "right: 0px", desc: "Sets right offset to 0px." },
    ],
  },
  {
    id: "effects",
    title: "Effects",
    intro:
      "Effects utilities handle border-radius, shadows, cursor styles, and interactive 3D transforms.",
    utilities: [
      { cls: "tw-rounded", css: "border-radius: 8px", desc: "Applies 8px border-radius.", preview: { borderRadius: "8px", background: "#e0e7ff", padding: "20px" } },
      { cls: "tw-border", css: "border: 1px solid #ccc", desc: "Applies a light border.", preview: { border: "1px solid #ccc", padding: "16px", borderRadius: 6 } },
      { cls: "tw-shadow-soft", css: "box-shadow: 0 5px 10px rgba(0,0,0,0.2)", desc: "Soft elevation shadow.", preview: { boxShadow: "0 5px 10px rgba(0,0,0,0.2)", padding: "20px", borderRadius: 8, background: "#fff" } },
      { cls: "tw-shadow-hard", css: "box-shadow: 0 15px 30px rgba(0,0,0,0.5)", desc: "Heavy, dramatic shadow.", preview: { boxShadow: "0 15px 30px rgba(0,0,0,0.5)", padding: "20px", borderRadius: 8, background: "#fff" } },
      { cls: "tw-glow-blue", css: "box-shadow: 0 0 15px blue", desc: "Colored glow effect.", preview: { boxShadow: "0 0 15px blue", padding: "20px", borderRadius: 8, background: "#fff" } },
      { cls: "tw-shadow-5", css: "box-shadow: 0 5px 10px rgba(0,0,0,0.3)", desc: "Numeric shadow depth.", preview: { boxShadow: "0 5px 10px rgba(0,0,0,0.3)", padding: "20px", borderRadius: 8, background: "#fff" } },
      { cls: "tw-cursor-pointer", css: "cursor: pointer", desc: "Sets pointer cursor on hover." },
      { cls: "tw-cursor-default", css: "cursor: default", desc: "Sets default cursor." },
      { cls: "tw-card-3d", css: "transform: rotateX/Y on mousemove", desc: "Interactive 3D tilt effect that follows cursor movement." },
    ],
  },
  {
    id: "components",
    title: "Custom Components",
    intro:
      "Talwinder CSS also registers custom HTML elements (Web Components) that you can use directly in your markup like native tags.",
    utilities: [
      { cls: "<login-card>", css: "Web Component", desc: "Renders a styled login form with username/password inputs and a login button." },
      { cls: "<fancy-btn>", css: "Web Component", desc: "Renders a styled button with padding, blue background, white text, and rounded corners." },
      { cls: "<glass-card>", css: "Web Component", desc: "Renders a frosted glass-style card container." },
      { cls: "<card-3d>", css: "Web Component", desc: "Renders a card with interactive 3D tilt effect on mouse move." },
      { cls: "<gol-roti>", css: "Web Component", desc: "Fun component — renders a 100×100 yellow circle (roti shape!)." },
      { cls: "<spin-loader>", css: "Web Component", desc: "Renders a spinning loading indicator with CSS animation." },
    ],
  },
];

const ALL_ITEMS = SECTIONS.flatMap((s) =>
  s.utilities.map((u) => ({ ...u, sectionId: s.id, sectionTitle: s.title }))
);

/* ────────────────────────────────────────────────────
   CODE BLOCK w/ copy button
   ──────────────────────────────────────────────────── */

function CodeBlock({ code, lang = "html" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [code]);

  // Simple syntax highlight
  const highlighted = useMemo(() => {
    if (lang === "css") {
      return code
        .replace(/([\w-]+)\s*:/g, '<span class="prop">$1</span>:')
        .replace(/:\s*([^;]+)/g, ': <span class="val">$1</span>');
    }
    // Escape HTML entities first
    let html = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    // Highlight tags: <tag-name> or <tag-name (with attrs) or </tag-name>
    html = html.replace(
      /(&lt;\/?)([\w-]+)/g,
      '$1<span class="tag">$2</span>'
    );
    // Highlight attributes: name="value"
    html = html.replace(
      /([\w-]+)=&quot;([^&]*)&quot;/g,
      '<span class="attr">$1</span>=&quot;<span class="str">$2</span>&quot;'
    );
    html = html.replace(
      /([\w-]+)="([^"]*)"/g,
      '<span class="attr">$1</span>="<span class="str">$2</span>"'
    );
    return html;
  }, [code, lang]);

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span>{lang.toUpperCase()}</span>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? (
            <>
              <Check size={12} style={{ marginRight: 4, display: "inline" }} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={12} style={{ marginRight: 4, display: "inline" }} />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="code-block">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   SMART PREVIEW — generate preview styles for utilities without explicit preview
   ──────────────────────────────────────────────────── */

function getSmartPreview(util: UtilityDef): React.CSSProperties {
  const base: React.CSSProperties = { padding: 16, background: "#e0e7ff", borderRadius: 6 };
  const cls = util.cls;

  // Flexbox utilities
  if (cls === "tw-flex") return { ...base, display: "flex", gap: 8 };
  if (cls === "tw-flex-row") return { ...base, display: "flex", flexDirection: "row", gap: 8 };
  if (cls === "tw-flex-col") return { ...base, display: "flex", flexDirection: "column", gap: 8, minHeight: 100 };
  if (cls === "tw-flex-center") return { ...base, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 120 };
  if (cls === "tw-justify-center") return { ...base, display: "flex", justifyContent: "center", minHeight: 80 };
  if (cls === "tw-justify-between") return { ...base, display: "flex", justifyContent: "space-between", minWidth: 200 };
  if (cls === "tw-items-center") return { ...base, display: "flex", alignItems: "center", minHeight: 80 };

  // Position utilities
  if (cls === "tw-relative") return { ...base, position: "relative", border: "2px dashed #7c3aed", minHeight: 80 };
  if (cls === "tw-absolute") return { ...base, position: "relative", border: "2px dashed #dc2626", minHeight: 80 };
  if (cls === "tw-fixed") return { ...base, border: "2px dashed #2563eb", minHeight: 80 };
  if (cls.startsWith("tw-top-")) return { ...base, position: "relative", top: cls.split("-")[2] + "px", border: "2px dashed #7c3aed", minHeight: 80 };
  if (cls.startsWith("tw-left-")) return { ...base, position: "relative", left: cls.split("-")[2] + "px", border: "2px dashed #7c3aed" };
  if (cls.startsWith("tw-bottom-")) return { ...base, position: "relative", bottom: cls.split("-")[2] + "px", border: "2px dashed #7c3aed", minHeight: 80 };
  if (cls.startsWith("tw-right-")) return { ...base, position: "relative", right: cls.split("-")[2] + "px", border: "2px dashed #7c3aed" };

  // Cursor utilities
  if (cls === "tw-cursor-pointer") return { ...base, cursor: "pointer" };
  if (cls === "tw-cursor-default") return { ...base, cursor: "default" };

  // Card-3d
  if (cls === "tw-card-3d") return { ...base, background: "#4f46e5", color: "#fff", transform: "perspective(500px) rotateY(-6deg) rotateX(4deg)", boxShadow: "0 12px 30px rgba(0,0,0,0.25)" };

  return base;
}

/* ────────────────────────────────────────────────────
   TRY-IT BOX — live preview for a utility
   ──────────────────────────────────────────────────── */

function TryItBox({ util }: { util: UtilityDef }) {
  const isComponent = util.cls.startsWith("<");

  if (isComponent) {
    // Render component examples
    const tag = util.cls.replace(/[<>]/g, "");

    const componentPreviews: Record<string, React.ReactNode> = {
      "login-card": (
        <div style={{ background: "blue", padding: 16, borderRadius: 8, color: "white", width: 250 }}>
          <h4 style={{ margin: "0 0 12px", fontSize: 16 }}>Login</h4>
          <input placeholder="Username" style={{ display: "block", width: "100%", padding: "6px 10px", marginBottom: 8, borderRadius: 4, border: "none", fontSize: 13 }} readOnly />
          <input placeholder="Password" type="password" style={{ display: "block", width: "100%", padding: "6px 10px", marginBottom: 8, borderRadius: 4, border: "none", fontSize: 13 }} readOnly />
          <button style={{ padding: "6px 16px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 13 }}>Login</button>
        </div>
      ),
      "fancy-btn": (
        <button style={{ padding: "8px 16px", background: "blue", color: "white", borderRadius: 8, border: "none", fontSize: 14, cursor: "pointer" }}>
          Click Me
        </button>
      ),
      "glass-card": (
        <div style={{ padding: 16, borderRadius: 8, background: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.3)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          Glass content
        </div>
      ),
      "card-3d": (
        <div style={{ padding: 16, background: "blue", borderRadius: 8, color: "white", transform: "perspective(500px) rotateY(-8deg) rotateX(5deg)", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
          Hover me (3D effect)
        </div>
      ),
      "gol-roti": (
        <div style={{ width: 100, height: 100, backgroundColor: "yellow", borderRadius: "50%", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }} />
      ),
      "spin-loader": (
        <div style={{ width: 40, height: 40, border: "5px solid #ccc", borderTop: "5px solid blue", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      ),
    };

    return (
      <div className="try-it-box fade-in">
        <div className="try-it-header">
          <span>
            <Zap size={14} style={{ marginRight: 6, display: "inline", verticalAlign: -2 }} />
            Try it — {`<${tag}>`}
          </span>
        </div>
        <div className="try-it-preview" style={{ background: tag === "glass-card" ? "linear-gradient(135deg,#667eea,#764ba2)" : undefined }}>
          {componentPreviews[tag] || <span style={{ color: "#888" }}>Preview not available</span>}
        </div>
        <div style={{ borderTop: "1px solid #e5e5e5" }}>
          <CodeBlock code={`<${tag}>${tag === "fancy-btn" ? "Click Me" : tag === "glass-card" ? "Glass content" : tag === "card-3d" ? "Hover me" : ""}</${tag}>`} />
        </div>
      </div>
    );
  }

  // Regular utility preview — build a smart preview for every utility
  const smartPreview = util.preview || getSmartPreview(util);

  return (
    <div className="try-it-box fade-in">
      <div className="try-it-header">
        <span>
          <Zap size={14} style={{ marginRight: 6, display: "inline", verticalAlign: -2 }} />
          Try it — {util.cls}
        </span>
      </div>
      <div className="try-it-preview">
        <div className="try-it-preview-item" style={smartPreview}>
          Talwinder element
        </div>
      </div>
      <div style={{ borderTop: "1px solid #e5e5e5" }}>
        <CodeBlock code={`<div class="${util.cls}">Talwinder element</div>`} />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   SEARCH MODAL
   ──────────────────────────────────────────────────── */

function SearchModal({
  open,
  onClose,
  onNav,
}: {
  open: boolean;
  onClose: () => void;
  onNav: (sectionId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return ALL_ITEMS.slice(0, 8);
    const q = query.toLowerCase();
    return ALL_ITEMS.filter(
      (item) =>
        item.cls.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.sectionTitle.toLowerCase().includes(q)
    );
  }, [query]);

  if (!open) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal fade-in" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Search
            size={18}
            style={{ marginLeft: 16, color: "#888", flexShrink: 0 }}
          />
          <input
            ref={inputRef}
            className="search-modal-input"
            placeholder="Search Talwinder utilities…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={onClose}
            style={{
              padding: "8px 12px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#888",
            }}
          >
            <X size={18} />
          </button>
        </div>
        <div className="search-results">
          {results.length === 0 && (
            <div style={{ padding: "24px 20px", color: "#888", textAlign: "center", fontSize: 14 }}>
              No results found for "{query}"
            </div>
          )}
          {results.map((item, i) => (
            <div
              key={i}
              className="search-result-item"
              onClick={() => {
                onNav(item.sectionId);
                onClose();
              }}
            >
              <div className="search-cat">{item.sectionTitle}</div>
              <div>
                <code style={{ color: "#d63384", background: "#f0f0f0", padding: "1px 6px", borderRadius: 3, fontSize: 12.5, marginRight: 8 }}>
                  {item.cls}
                </code>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   MAIN APP
   ──────────────────────────────────────────────────── */

export default function App() {
  const [activeSection, setActiveSection] = useState("spacing");
  const [sidebarFilter, setSidebarFilter] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeTocId, setActiveTocId] = useState("");
  const [selectedPreview, setSelectedPreview] = useState<Record<string, number>>({});

  // Scroll spy for right sidebar TOC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveTocId(entry.target.id);
          }
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === "Escape") setShowSearch(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filteredSections = useMemo(() => {
    if (!sidebarFilter.trim()) return SECTIONS;
    const q = sidebarFilter.toLowerCase();
    return SECTIONS.map((s) => ({
      ...s,
      utilities: s.utilities.filter(
        (u) =>
          u.cls.toLowerCase().includes(q) ||
          u.desc.toLowerCase().includes(q)
      ),
    })).filter((s) => s.utilities.length > 0 || s.title.toLowerCase().includes(q));
  }, [sidebarFilter]);

  const scrollTo = useCallback((id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const currentSection = SECTIONS.find((s) => s.id === (activeTocId || activeSection));

  return (
    <div style={{ background: isDark ? "#181818" : "#fff", color: isDark ? "#e0e0e0" : "#1b1b1b", minHeight: "100vh" }}>
      {/* ── HEADER ─────────────────────────────────── */}
      <header className="mdn-header">
        <div className="mdn-header-inner">
          <div className="mdn-logo">
            <BookOpen size={22} />
            <span>
              talwinder<span className="logo-accent">_</span>
            </span>
          </div>

          <nav className="mdn-nav">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={activeTocId === s.id || (!activeTocId && activeSection === s.id) ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(s.id);
                }}
              >
                {s.title}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="search-btn"
              onClick={() => setShowSearch(true)}
            >
              <Search size={14} />
              Search
              <kbd>Ctrl+K</kbd>
            </button>
            <button
              className="theme-btn"
              onClick={() => setIsDark(!isDark)}
              title="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── BREADCRUMBS ────────────────────────────── */}
      <div className="breadcrumbs-bar" style={isDark ? { background: "#222", borderColor: "#333" } : {}}>
        <div className="breadcrumbs-inner">
          <div className="breadcrumbs">
            <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("spacing"); }}>Talwinder CSS</a>
            <ChevronRight size={12} className="sep" />
            <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("spacing"); }}>Utilities</a>
            {currentSection && (
              <>
                <ChevronRight size={12} className="sep" />
                <span style={{ color: isDark ? "#aaa" : "#666" }}>{currentSection.title}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── 3-COLUMN LAYOUT ────────────────────────── */}
      <div className="docs-layout">
        {/* LEFT SIDEBAR */}
        <aside className="left-sidebar" style={isDark ? { background: "#1e1e1e", borderColor: "#333" } : {}}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 16px", marginBottom: 12 }}>
            <Search size={14} style={{ color: "#999", flexShrink: 0 }} />
            <input
              className="sidebar-filter"
              placeholder="Filter sidebar…"
              value={sidebarFilter}
              onChange={(e) => setSidebarFilter(e.target.value)}
              style={isDark ? { background: "#2a2a2a", borderColor: "#444", color: "#ddd" } : {}}
            />
          </div>

          {filteredSections.map((section) => (
            <div key={section.id}>
              <div
                className="sidebar-section-title"
                style={isDark ? { color: "#ddd" } : {}}
              >
                {section.title}
              </div>
              {section.utilities.map((u, uIdx) => (
                <a
                  key={u.cls}
                  className={`sidebar-link ${activeTocId === section.id && selectedPreview[section.id] === uIdx ? "active" : ""
                    }`}
                  onClick={() => {
                    setSelectedPreview((prev) => ({ ...prev, [section.id]: uIdx }));
                    scrollTo(section.id);
                  }}
                  style={isDark ? { color: "#aaa" } : {}}
                >
                  {u.cls}
                </a>
              ))}
            </div>
          ))}
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content" style={isDark ? { background: "#1b1b1b" } : {}}>
          {/* Page Title */}
          <h1>Talwinder CSS Reference</h1>
          <p style={{ fontSize: 16, marginTop: 8 }}>
            A utility-first CSS framework with the <code>tw-</code> prefix. Every class maps directly to
            a CSS property through the Talwinder engine — no build step, no config files, just add classes.
          </p>

          <CodeBlock lang="bash" code={`npm install talwinder-css`} />

          <div className="callout note" style={{ marginTop: 24 }}>
            <div className="callout-title">Note</div>
            All <code>tw-</code> utilities are processed at runtime by the Talwinder engine via
            the <code>initEngine()</code> function. Include the engine script and call it after
            your DOM is ready.
          </div>

          <CodeBlock
            lang="html"
            code={`<script src="talwinder.js"></script>\n<script>\n  document.addEventListener("DOMContentLoaded", () => {\n    initEngine();\n  });\n</script>`}
          />

          {/* ── EACH SECTION ─────────────────────── */}
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id}>
              <h2>{section.title}</h2>
              <div className="section-intro">
                <p>{section.intro}</p>
              </div>

              {/* Reference Table */}
              <div className="ref-table-wrap">
                <table className="ref-table" style={isDark ? { borderColor: "#333" } : {}}>
                  <thead>
                    <tr>
                      <th style={isDark ? { background: "#252525", borderColor: "#333", color: "#ddd" } : {}}>Class</th>
                      <th style={isDark ? { background: "#252525", borderColor: "#333", color: "#ddd" } : {}}>CSS Output</th>
                      <th style={isDark ? { background: "#252525", borderColor: "#333", color: "#ddd" } : {}}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.utilities.map((u, i) => (
                      <tr
                        key={u.cls}
                        style={{
                          cursor: "pointer",
                          background: selectedPreview[section.id] === i ? (isDark ? "#2a2a3a" : "#eef2ff") : undefined,
                        }}
                        onClick={() => {
                          setSelectedPreview((prev) => ({
                            ...prev,
                            [section.id]: i,
                          }));
                        }}
                      >
                        <td style={isDark ? { borderColor: "#333", color: "#e0e0e0" } : {}}>
                          <code>{u.cls}</code>
                        </td>
                        <td style={isDark ? { borderColor: "#333", color: "#ccc" } : {}}>
                          <code style={{ color: "#2563eb", background: isDark ? "#1e293b" : "#eff6ff" }}>{u.css}</code>
                        </td>
                        <td style={isDark ? { borderColor: "#333", color: "#aaa" } : {}}>
                          {u.desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Try-it preview for selected or first utility with preview */}
              {(() => {
                const previewIdx = selectedPreview[section.id] ?? 0;
                const util = section.utilities[previewIdx] || section.utilities.find(u => u.preview) || section.utilities[0];
                return <TryItBox util={util} />;
              })()}

              {/* Syntax Example */}
              {section.id !== "components" && (
                <h3>Syntax</h3>
              )}
              {section.id !== "components" ? (
                <CodeBlock
                  lang="html"
                  code={section.utilities
                    .filter(u => !u.cls.startsWith("<"))
                    .map((u) => `<div class="${u.cls}">…</div>`)
                    .join("\n")}
                />
              ) : (
                <CodeBlock
                  lang="html"
                  code={section.utilities
                    .map((u) => {
                      const tag = u.cls.replace(/[<>]/g, "");
                      if (tag === "spin-loader" || tag === "gol-roti") {
                        return `<${tag}></${tag}>`;
                      }
                      return `<${tag}>Your content here</${tag}>`;
                    })
                    .join("\n")}
                />
              )}

              {section.id === "spacing" && (
                <div className="callout tip">
                  <div className="callout-title">Tip</div>
                  The multiplier is always <strong>×4</strong>. So <code>tw-p-1</code> = 4px,{" "}
                  <code>tw-p-2</code> = 8px, <code>tw-p-10</code> = 40px, and so on.
                </div>
              )}

              {section.id === "color" && (
                <div className="callout note">
                  <div className="callout-title">Note</div>
                  Any valid CSS color name works: <code>tw-bg-coral</code>,{" "}
                  <code>tw-bg-tomato</code>, <code>tw-text-skyblue</code>, etc.
                  The engine passes the color string directly to the style property.
                </div>
              )}

              {section.id === "typography" && (
                <div className="callout note">
                  <div className="callout-title">Note</div>
                  The engine checks if the value after <code>text-</code> is numeric.
                  If yes → <code>font-size</code>. If no → <code>color</code>.
                  Special keywords like <code>bold</code> and <code>center</code> are handled separately.
                </div>
              )}

              {section.id === "effects" && (
                <div className="callout tip">
                  <div className="callout-title">Tip</div>
                  The <code>tw-card-3d</code> utility adds mouse-tracking 3D rotation.
                  It automatically attaches <code>mousemove</code> and <code>mouseleave</code> event
                  listeners to create an interactive tilt effect.
                </div>
              )}

              {section.id === "components" && (
                <div className="callout note">
                  <div className="callout-title">Note</div>
                  These are registered via <code>customElements.define()</code> and use
                  Talwinder utilities internally. They work like native HTML tags — no imports needed.
                </div>
              )}
            </section>
          ))}

          {/* Engine Source */}
          <section id="engine">
            <h2>Engine Source</h2>
            <p>
              The Talwinder CSS engine is a single JavaScript function that scans all elements for <code>tw-</code> prefixed
              classes and applies the corresponding inline styles at runtime. Here's the core pattern:
            </p>
            <CodeBlock
              lang="js"
              code={`export function initEngine() {\n  const elements = document.querySelectorAll("[class]");\n  elements.forEach((el) => {\n    el.classList.forEach((cls) => {\n      if (!cls.startsWith("tw-")) return;\n      const actual = cls.slice(3);\n      // Parse and apply styles...\n    });\n  });\n}`}
            />
          </section>
        </main>

        {/* RIGHT SIDEBAR — TOC */}
        <aside className="right-sidebar" style={isDark ? { background: "#1e1e1e" } : {}}>
          <div className="toc-title">In this article</div>
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              className={`toc-link ${activeTocId === s.id ? "active" : ""}`}
              onClick={() => scrollTo(s.id)}
            >
              {s.title}
            </a>
          ))}
          <a
            className={`toc-link ${activeTocId === "engine" ? "active" : ""}`}
            onClick={() => scrollTo("engine")}
          >
            Engine Source
          </a>
        </aside>
      </div>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer className="mdn-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            talwinder<span style={{ color: "#8b5cf6" }}>_</span>
          </div>
          <p>A utility-first CSS framework — our classes, our syntax, our engine.</p>
          <div className="footer-links">
            <a href="#spacing">Spacing</a>
            <a href="#layout">Layout</a>
            <a href="#color">Color</a>
            <a href="#typography">Typography</a>
            <a href="#effects">Effects</a>
            <a href="#components">Components</a>
          </div>
          <p style={{ marginTop: 20, fontSize: 12, color: "#666" }}>
            Built with ❤️ using Talwinder CSS Engine
          </p>
        </div>
      </footer>

      {/* ── SEARCH MODAL ───────────────────────────── */}
      <SearchModal
        open={showSearch}
        onClose={() => setShowSearch(false)}
        onNav={scrollTo}
      />

      {/* spin animation for loader component */}
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
