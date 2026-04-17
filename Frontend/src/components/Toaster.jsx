import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// ─── Context ────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

// ─── Icons ──────────────────────────────────────────────────────────────────
const icons = {
  error: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  ),
  success: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  ),
};

// ─── Variant tokens ──────────────────────────────────────────────────────────
const variants = {
  error: {
    bg: "rgba(25, 14, 14, 0.96)",
    border: "rgba(220, 60, 60, 0.35)",
    iconColor: "#e05252",
    progressColor: "#c03030",
    textColor: "#f0b0b0",
  },
  success: {
    bg: "rgba(10, 20, 14, 0.96)",
    border: "rgba(52, 180, 80, 0.35)",
    iconColor: "#4ac870",
    progressColor: "#34b450",
    textColor: "#a0e0b0",
  },
  info: {
    bg: "rgba(12, 16, 28, 0.96)",
    border: "rgba(201, 168, 76, 0.35)",
    iconColor: "#c9a84c",
    progressColor: "#a07a2a",
    textColor: "#d4be88",
  },
};

// ─── Single Toast Item ───────────────────────────────────────────────────────
const DURATION = 4500; // ms

function ToastItem({ id, variant = "error", message, onRemove }) {
  const v = variants[variant] ?? variants.error;
  const [visible, setVisible] = useState(false);    // controls enter anim
  const [leaving, setLeaving] = useState(false);    // controls exit anim
  const [progress, setProgress] = useState(100);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const timerRef = useRef(null);

  // Enter
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Progress bar + auto-dismiss
  useEffect(() => {
    startRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - startRef.current;
      const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(remaining);
      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    timerRef.current = setTimeout(() => dismiss(), DURATION);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismiss = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    clearTimeout(timerRef.current);
    setLeaving(true);
    setTimeout(() => onRemove(id), 350);
  }, [id, onRemove]);

  const transform = visible && !leaving
    ? "translateX(0)"
    : "translateX(calc(100% + 24px))";

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "13px 14px 0",
        borderRadius: "14px",
        background: v.bg,
        border: `1px solid ${v.border}`,
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
        width: "340px",
        maxWidth: "calc(100vw - 48px)",
        overflow: "hidden",
        position: "relative",
        transform,
        opacity: leaving ? 0 : 1,
        transition: "transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.3s ease",
        fontFamily: "'Inter', sans-serif",
        flexShrink: 0,
      }}
    >
      {/* Icon */}
      <span style={{ color: v.iconColor, flexShrink: 0, marginTop: "1px" }}>
        {icons[variant] ?? icons.error}
      </span>

      {/* Message */}
      <p style={{
        flex: 1,
        fontSize: "13px",
        lineHeight: "1.5",
        color: v.textColor,
        padding: "0 0 13px",
        margin: 0,
        wordBreak: "break-word",
      }}>
        {message}
      </p>

      {/* Close button */}
      <button
        onClick={dismiss}
        aria-label="Dismiss notification"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(255,255,255,0.25)",
          fontSize: "15px",
          lineHeight: 1,
          padding: "0 0 13px",
          flexShrink: 0,
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
      >
        ✕
      </button>

      {/* Progress bar */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0,
        height: "2px",
        width: `${progress}%`,
        background: v.progressColor,
        borderRadius: "0 0 14px 14px",
        transition: "width 0.1s linear",
      }} />
    </div>
  );
}

// ─── Provider ────────────────────────────────────────────────────────────────
let _idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, variant = "info") => {
    const id = ++_idCounter;
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div
          aria-label="Notifications"
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "flex-end",
            pointerEvents: "none",
          }}
        >
          {toasts.map((t) => (
            <div key={t.id} style={{ pointerEvents: "auto" }}>
              <ToastItem
                id={t.id}
                variant={t.variant}
                message={t.message}
                onRemove={remove}
              />
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx.toast;
}
