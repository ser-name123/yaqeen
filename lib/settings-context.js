"use client";

import { createContext, useContext } from "react";

const SettingsContext = createContext({
  logoText: "yaqeen",
  logoUrl: "",
  faviconUrl: "",
});

export function SettingsProvider({ children, logoText, logoUrl, faviconUrl }) {
  return (
    <SettingsContext.Provider value={{ logoText, logoUrl, faviconUrl }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
