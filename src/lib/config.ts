import type { SiteSettings } from "./types";

export const siteConfig: SiteSettings = {
  siteName: "Insightly",
  siteDescription: "Stories and practical ideas for everyday life: health, travel, food, blogging, culture, personal growth, and more.",
  metaTitle: "Insightly — Stories for every side of life",
  metaDescription: "Stories and practical ideas for everyday life: health, travel, food, blogging, culture, personal growth, and more.",
  seoKeywords: ["lifestyle", "health and wellness", "travel", "food", "blogging", "personal growth", "home", "culture", "relationships", "technology"],
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@insightly.example",
  defaultOgImage:
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=85",
  customLinks: [],
  socialLinks: {
    twitter: "https://x.com/insightly",
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
    facebook: "",
    tiktok: "",
    pinterest: "",
  },
};

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const usingFirebaseEmulators = Boolean(process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST || process.env.FIREBASE_STORAGE_EMULATOR_HOST);
export const isFirebaseConfigured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && ((process.env.FIREBASE_ADMIN_PROJECT_ID && process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY) || usingFirebaseEmulators));
