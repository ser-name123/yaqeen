"use client";

import { createContext, useContext } from "react";

const SettingsContext = createContext({
  logoText: "yaqeen",
  logoUrl: "",
  faviconUrl: "",
  contactEmail: "info@yaqeeninstitute.com",
  contactPhone: "+447488818192",
  contactHours: "24x7 - We're always here for you.",
  contactSupport: "We serve students from around the world.",
  socialFacebook: "",
  socialInstagram: "",
  socialYoutube: "",
  socialWhatsapp: ""
});

export function SettingsProvider({ 
  children, 
  logoText, 
  logoUrl, 
  faviconUrl,
  contactEmail,
  contactPhone,
  contactHours,
  contactSupport,
  socialFacebook,
  socialInstagram,
  socialYoutube,
  socialWhatsapp
}) {
  return (
    <SettingsContext.Provider value={{ 
      logoText, 
      logoUrl, 
      faviconUrl,
      contactEmail,
      contactPhone,
      contactHours,
      contactSupport,
      socialFacebook,
      socialInstagram,
      socialYoutube,
      socialWhatsapp
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
