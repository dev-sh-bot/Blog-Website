import { loadEnvConfig } from "@next/env";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { demoAuthors, demoCategories, demoPosts, demoTags } from "../src/lib/seed-data";

loadEnvConfig(process.cwd());

const required = ["FIREBASE_ADMIN_PROJECT_ID", "FIREBASE_ADMIN_CLIENT_EMAIL", "FIREBASE_ADMIN_PRIVATE_KEY"];
for (const key of required) if (!process.env[key]) throw new Error(`Missing ${key}. Copy .env.example to .env.local and provide Firebase Admin credentials.`);
const app = getApps()[0] ?? initializeApp({ credential: cert({ projectId: process.env.FIREBASE_ADMIN_PROJECT_ID, clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL, privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, "\n") }) });
const db = getFirestore(app);
async function seed() {
  const batch = db.batch();
  demoAuthors.forEach((item) => batch.set(db.collection("authors").doc(item.id), item));
  demoCategories.forEach((item) => batch.set(db.collection("categories").doc(item.id), item));
  demoTags.forEach((item) => batch.set(db.collection("tags").doc(item.id), item));
  demoPosts.forEach((item) => { batch.set(db.collection("posts").doc(item.id), { ...item, publishedAt: Timestamp.fromDate(new Date(item.publishedAt)), createdAt: Timestamp.fromDate(new Date(item.createdAt)), updatedAt: Timestamp.fromDate(new Date(item.updatedAt)) }); batch.set(db.collection("media").doc(`seed-${item.id}`), { name: item.featuredImage.alt, path: "seed", url: item.featuredImage.url, contentType: "image/jpeg", size: 0, alt: item.featuredImage.alt, createdAt: Timestamp.fromDate(new Date(item.createdAt)), source: "seed" }, { merge: true }); });
  batch.set(db.collection("settings").doc("site"), { siteName: "Insightly", siteDescription: "Technology, business and digital insights for curious builders.", metaTitle: "Insightly — Stories for every side of life", metaDescription: "Stories and practical ideas for everyday life: health, travel, food, blogging, culture, personal growth, and more.", seoKeywords: ["lifestyle", "health and wellness", "travel", "food", "blogging", "personal growth", "home", "culture", "relationships", "technology"], googleSiteVerification: "", socialLinks: { twitter: "https://x.com/insightly", linkedin: "https://www.linkedin.com/", instagram: "https://www.instagram.com/", youtube: "https://www.youtube.com/", facebook: "", tiktok: "", pinterest: "" }, updatedAt: new Date().toISOString() }, { merge: true });
  await batch.commit(); console.log(`Seeded ${demoPosts.length} posts, ${demoAuthors.length} authors, ${demoCategories.length} categories and ${demoTags.length} tags.`);
}
seed().catch((error) => { console.error(error); process.exitCode = 1; });
