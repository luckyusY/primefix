"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/* ── Types ── */
const STORAGE_KEY = "primefix-cookie-consent";
const COOKIE_KEY  = "primefix_cookie_consent";

type ConsentValue = "necessary" | "all" | null;
type TawkWindow   = Window & {
  Tawk_API?: {
    customStyle?: { visibility?: object };
    hideWidget?: () => void;
    shutdown?:   () => void;
  };
};

/* ── Helpers ── */
function setConsentCookie(value: Exclude<ConsentValue, null>) {
  document.cookie = `${COOKIE_KEY}=${value}; path=/; max-age=31536000; SameSite=Lax`;
}

function loadTawk() {
  if (document.getElementById("tawk-script")) return;
  const s = document.createElement("script");
  s.id = "tawk-script";
  s.async = true;
  s.src = "https://embed.tawk.to/69d172a5b8aa781c3b31044d/1jld2fnpb";
  s.charset = "UTF-8";
  s.setAttribute("crossorigin", "*");
  const w = window as TawkWindow;
  w.Tawk_API = {
    ...(w.Tawk_API ?? {}),
    customStyle: {
      visibility: {
        desktop: { position: "br", xOffset: 20, yOffset: 20 },
        mobile:  { position: "br", xOffset: 10, yOffset: 10 },
      },
    },
  };
  document.body.appendChild(s);
}

function unloadTawk() {
  const w = window as TawkWindow;
  w.Tawk_API?.hideWidget?.();
  w.Tawk_API?.shutdown?.();
  document.getElementById("tawk-script")?.remove();
}

/* ── Context ── */
type CookieContextValue = {
  consent:      ConsentValue;
  openSettings: () => void;
};

const CookieContext = createContext<CookieContextValue | null>(null);

export function useCookieConsent() {
  const ctx = useContext(CookieContext);
  if (!ctx) throw new Error("useCookieConsent must be used inside CookieConsentProvider");
  return ctx;
}

/* ── Provider ── */
export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent,    setConsent]    = useState<ConsentValue>(null);
  const [ready,      setReady]      = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ConsentValue;
    if (saved === "necessary" || saved === "all") {
      setConsent(saved);
      if (saved === "all") loadTawk();
    } else {
      setShowBanner(true);
    }
    setReady(true);
  }, []);

  const handleConsent = (value: Exclude<ConsentValue, null>) => {
    value === "all" ? loadTawk() : unloadTawk();
    setConsent(value);
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsentCookie(value);
    setShowBanner(false);
  };

  const ctx = useMemo<CookieContextValue>(
    () => ({ consent, openSettings: () => setShowBanner(true) }),
    [consent]
  );

  return (
    <CookieContext.Provider value={ctx}>
      {children}

      {/* Banner — shown on first visit or when user reopens settings */}
      {ready && showBanner && (
        <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
          <div className="cookie-banner__copy">
            <strong>Cookies on PrimeFix London</strong>
            <p>
              We use essential cookies to keep the website working. Optional
              cookies enable live chat and help us improve the booking experience.
            </p>
          </div>
          <div className="cookie-banner__actions">
            <button
              type="button"
              className="btn btn-outline cookie-banner__btn cookie-banner__btn--ghost"
              onClick={() => handleConsent("necessary")}
            >
              Necessary Only
            </button>
            <button
              type="button"
              className="btn btn-teal cookie-banner__btn"
              onClick={() => handleConsent("all")}
            >
              Accept All
            </button>
          </div>
        </div>
      )}
    </CookieContext.Provider>
  );
}
