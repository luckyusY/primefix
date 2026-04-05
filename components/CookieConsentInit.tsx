"use client";

import { useEffect } from "react";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";

type TawkWindow = Window & {
  Tawk_API?: {
    customStyle?: { visibility?: object };
    hideWidget?: () => void;
    shutdown?: () => void;
  };
};

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
        mobile: { position: "br", xOffset: 10, yOffset: 10 },
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

export default function CookieConsentInit() {
  useEffect(() => {
    void CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: "bar",
          position: "bottom",
          equalWeightButtons: false,
          flipButtons: false,
        },
        preferencesModal: {
          layout: "box",
          position: "right",
          equalWeightButtons: true,
        },
      },
      categories: {
        necessary: { readOnly: true },
        functional: {},
      },
      language: {
        default: "en",
        translations: {
          en: {
            consentModal: {
              title: "Cookies on PrimeFix London",
              description:
                "We use essential cookies to keep the website working. Optional cookies enable live chat and help improve your booking experience.",
              acceptAllBtn: "Accept All",
              acceptNecessaryBtn: "Necessary Only",
              showPreferencesBtn: "Manage Preferences",
            },
            preferencesModal: {
              title: "Cookie Preferences",
              acceptAllBtn: "Accept All",
              acceptNecessaryBtn: "Necessary Only",
              savePreferencesBtn: "Save Preferences",
              closeIconLabel: "Close",
              sections: [
                {
                  title: "Strictly Necessary",
                  description:
                    "These cookies are required for the website to function and cannot be disabled.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Functional",
                  description:
                    "These cookies enable live chat support via Tawk.to and help improve your booking experience.",
                  linkedCategory: "functional",
                },
              ],
            },
          },
        },
      },
      onFirstConsent: ({ cookie }) => {
        if (cookie.categories.includes("functional")) loadTawk();
      },
      onConsent: ({ cookie }) => {
        if (cookie.categories.includes("functional")) loadTawk();
        else unloadTawk();
      },
      onChange: ({ cookie }) => {
        if (cookie.categories.includes("functional")) loadTawk();
        else unloadTawk();
      },
    });
  }, []);

  return null;
}
