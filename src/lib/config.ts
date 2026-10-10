import type { SiteSettings } from "./types";

export const siteConfig: SiteSettings = {
  siteName: "GeoVaultHQ",
  siteDescription: "Explore the places, ideas, and perspectives that bring our world closer.",
  metaTitle: "GeoVaultHQ — Unlocking the World",
  metaDescription: "Explore the places, people, and ideas that shape our world with GeoVaultHQ.",
  seoKeywords: ["geography", "travel", "world cultures", "places", "nature", "history", "global stories", "exploration", "people", "ideas"],
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@geovaulthq.example",
  defaultOgImage: "/geovaulthq-logo.png",
  customLinks: [],
  socialLinks: {
    twitter: "",
    linkedin: "",
    instagram: "",
    youtube: "",
    facebook: "",
    tiktok: "",
    pinterest: "",
  },
};

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const usingFirebaseEmulators = Boolean(process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST || process.env.FIREBASE_STORAGE_EMULATOR_HOST);
export const isFirebaseConfigured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && ((process.env.FIREBASE_ADMIN_PROJECT_ID && process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY) || usingFirebaseEmulators));
