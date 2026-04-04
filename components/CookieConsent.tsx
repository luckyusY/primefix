"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "primefix-cookie-consent";
const COOKIE_KEY = "primefix_cookie_consent";

type ConsentValue = "necessary" | "all" | null;
type TawkWindow = Window & {
  Tawk_API?: {
    customStyle?: {
      visibility?: {
        desktop?: { position: string; xOffset: number; yOffset: number };
        mobile?: { position: string; xOffset: number; yOffset: number };
      };
    };
    hideWidget?: () => void;
    shutdown?: () => void;
  };
};

function setConsentCookie(value: Exclude<ConsentValue, null>) {
  document.cookie = `${COOKIE_KEY}=${value}; path=/; max-age=31536000; SameSite=Lax`;
}

function loadTawk() {
  if (document.getElementById("tawk-script")) {
    return;
  }

  const script = document.createElement("script");
  script.id = "tawk-script";
  script.async = true;
  script.src = "https://embed.tawk.to/69d172a5b8aa781c3b31044d/1jld2fnpb";
  script.charset = "UTF-8";
  script.setAttribute("crossorigin", "*");

  const tawkWindow = window as TawkWindow;
  const tawkApi = tawkWindow.Tawk_API || {};

  tawkWindow.Tawk_API = {
    ...tawkApi,
    customStyle: {
      visibility: {
        desktop: { position: "br", xOffset: 20, yOffset: 20 },
        mobile: { position: "br", xOffset: 10, yOffset: 10 },
      },
    },
  };

  document.body.appendChild(script);
}

function unloadTawk() {
  const tawkWindow = window as TawkWindow;
  tawkWindow.Tawk_API?.hideWidget?.();
  tawkWindow.Tawk_API?.shutdown?.();
  document.getElementById("tawk-script")?.remove();
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentValue>(null);
  const [ready, setReady] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ConsentValue;

    if (saved === "necessary" || saved === "all") {
      setConsent(saved);
      if (saved === "all") {
        loadTawk();
      }
    } else {
      setShowBanner(true);
    }

    setReady(true);
  }, []);

  const handleConsent = (value: Exclude<ConsentValue, null>) => {
    if (value === "all") {
      loadTawk();
    } else {
      unloadTawk();
    }

    setConsent(value);
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsentCookie(value);
    setShowBanner(false);
  };

  if (!ready) {
    return null;
  }

  return (
    <>
      {showBanner ? (
        <div className="cookie-banner" role="dialog" aria-live="polite">
          <div className="cookie-banner__copy">
            <strong>Cookies on PrimeFix London</strong>
            <p>
              We use essential cookies to keep the website working. Optional
              cookies enable live chat and help us improve the booking
              experience.
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
      ) : null}

      {consent && !showBanner ? (
        <button
          type="button"
          className="cookie-manage"
          onClick={() => setShowBanner(true)}
        >
          Cookie Settings
        </button>
      ) : null}
    </>
  );
}
