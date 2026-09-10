import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const required = ["FIREBASE_ADMIN_PROJECT_ID", "FIREBASE_ADMIN_CLIENT_EMAIL", "FIREBASE_ADMIN_PRIVATE_KEY"];
for (const key of required) if (!process.env[key]) throw new Error(`Missing ${key}. Provide the server-only Firebase Admin environment variables.`);

const app = getApps()[0] ?? initializeApp({ credential: cert({ projectId: process.env.FIREBASE_ADMIN_PROJECT_ID, clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL, privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, "\n") }), storageBucket: process.env.FIREBASE_STORAGE_BUCKET });
const db = getFirestore(app);

async function publishScheduled() {
  const snapshot = await db.collection("posts").where("status", "==", "scheduled").where("publishedAt", "<=", Timestamp.now()).limit(500).get();
  if (snapshot.empty) { console.log("No scheduled posts are due."); return; }
  const batch = db.batch();
  const now = Timestamp.now();
  snapshot.docs.forEach((doc) => batch.update(doc.ref, { status: "published", updatedAt: now }));
  await batch.commit();
  console.log(`Published ${snapshot.size} scheduled post${snapshot.size === 1 ? "" : "s"}.`);
}

publishScheduled().catch((error) => { console.error(error); process.exitCode = 1; });
