# Insightly

Insightly is an editorial blog and Firebase-backed publishing CMS built with Next.js App Router, TypeScript, Tailwind CSS and Summernote.js.

The public site works immediately with the included realistic demo dataset. The admin area is protected by default and requires Firebase-backed authentication, Firestore persistence and an active admin allowlist record. A UI-only demo bypass is available only when explicitly enabled for local browser tests; never use it in production.

## Requirements

- Node.js 20 or newer
- npm
- A Firebase account for persistent data and admin publishing
- Java 11 or newer for the Firestore/Storage Emulator Suite and rules tests

## Run locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open http://localhost:3000. The editorial site is available before Firebase is configured; `/admin` redirects to `/admin/login` until Firebase Auth and the admin allowlist are set up.

### Dummy-data mode

For a Firebase-free preview, leave `.env.local` absent or leave the Firebase variables empty. The public site then uses the included realistic demo dataset and newsletter submissions are acknowledged without persistence. Do not set `INSIGHTLY_DEMO_ADMIN` on a deployed environment; it is only a local UI/test switch and does not enable API mutations.

Useful commands:

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
npm run seed
npm run publish:scheduled
npm run emulators
npm run deploy:auth
npm run deploy:rules
npm run deploy:indexes
npm run test:e2e
npm run test:rules
```

## Create Firebase from zero

1. Open the Firebase Console and create a new project, for example `insightly-blog`.
2. In Project settings, register a Web App and copy its public configuration values.
3. In Authentication → Sign-in method, enable Email/Password and Google.
4. Create a Firestore database in production mode.
5. Create a Realtime Database in locked mode. The project keeps its rules in `database.rules.json`; the current blog content remains in Firestore.
6. Create a Storage bucket. Cloud Storage requires the Blaze plan for current Firebase projects, even when usage stays within no-cost allowances.
7. The project includes the Firebase CLI as a dev dependency. Authenticate with `firebase login` or the local CLI binary when deploying or using emulators; do not install anything if the existing project dependencies are already present.
8. From this project directory, run `firebase use --add` and select the project.
9. Copy `.env.example` to `.env.local` and add the Web App values as `NEXT_PUBLIC_*` variables, including `NEXT_PUBLIC_FIREBASE_DATABASE_URL`.
10. In Firebase Project settings → Service accounts, generate a private key. Store its values only in server-side environment variables:
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PRIVATE_KEY`
   - `FIREBASE_STORAGE_BUCKET`
11. Deploy rules and indexes:

```bash
npm run deploy:rules
npm run deploy:indexes
npm run deploy:auth
```

Never commit the service-account JSON file, private key, `.env.local`, or any password.

## Create the first administrator

1. In Firebase Authentication, create a user with Email/Password or sign in once with Google.
2. Copy that user’s UID.
3. In Firestore, create `admins/{UID}` with:

```json
{
  "email": "your-email@example.com",
  "name": "Admin User",
  "role": "admin",
  "active": true
}
```

The server verifies both the Firebase session and the active admin document before allowing CMS mutations.

Use `role: "owner"` or `role: "admin"` for settings and taxonomy management. Use `role: "editor"` for post editing, publishing, media uploads and previews.

After the first owner is provisioned, the protected `/admin/admins` screen lets owner/admin users add an existing Firebase Auth user by email or create a new Email/Password Auth account, change allowlist roles, and change active status. Passwords are used only for the Firebase Auth creation request and are never stored in Firestore. Google-only accounts must be created in Firebase Authentication first. The screen prevents the last active owner from being removed, and only owners can add or promote another owner.

## Seed content

With Firebase Admin environment variables present:

```bash
npm run seed
```

The seed writes four authors, twelve categories, seventeen tags, eighteen realistic posts, matching media records, and default site settings. Homepage SEO title, description, keywords, verification token, OG image, social links, and additional custom links are managed from `/admin/settings`. It is safe to rerun because the seed uses deterministic document IDs.

Scheduled posts remain private until `npm run publish:scheduled` transitions them to `published` after their `publishedAt` time. Run that command from a deployment cron/job at a regular interval; public reads independently enforce both the published status and publish-time boundary.

## Local Firebase emulators

Install Java 11 or newer, then authenticate the included Firebase CLI and run:

```bash
npm run emulators
```

The emulator UI is available at http://localhost:4000. Production credentials must never be used for rule tests.

Run the rules suite in a disposable Emulator Suite process with `npm run test:rules`. It checks published and scheduled visibility, private settings/subscribers/media, active-admin mutations, and authorized versus unauthorized Storage image operations. Java 11+ must be installed and available on `PATH` because the Firestore and Storage emulators are Java processes.

For the browser and server adapters to use the local emulators, add the following values to `.env.local` while the suite is running:

```bash
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-insightly
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo-insightly.appspot.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=http://127.0.0.1:9000?ns=demo-insightly
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
FIREBASE_DATABASE_EMULATOR_HOST=127.0.0.1:9000
FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199
```

With these emulator host variables present, server-side Admin SDK access uses the local `demo-insightly` project and does not need production service-account credentials.

## Environment variables

See `.env.example` for the complete list. `NEXT_PUBLIC_*` Firebase Web App values are designed for browser use. Admin credentials are server-only and must not use the `NEXT_PUBLIC_` prefix.

Set `NEXT_PUBLIC_SITE_URL` to the real Vercel URL before production so canonicals, Open Graph URLs, RSS, sitemap and structured data are correct. `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is optional for Search Console verification metadata. Analytics is intentionally disabled in this project.

`INSIGHTLY_DEMO_ADMIN=true` is reserved for local UI-only browser tests. It does not configure Firebase, does not enable API mutations, and must never be set on a deployed environment.

## Security model

- Public Firestore reads are limited to published content and public taxonomy data.
- Drafts, future scheduled posts, subscribers, admin records and private settings are not public.
- Admin mutations require Firebase Authentication plus an active `admins/{uid}` document.
- Administrator role/active-state changes go through the server API; browser clients cannot write the `admins` collection directly.
- Public article assets uploaded by the editor are stored under `media/public/` so published pages can load them; the rules also reserve `media/editor/{uid}/` for private editor-only assets. Storage writes require an active admin and accept only JPEG, PNG and WEBP images up to 5 MB.
- Summernote HTML is sanitized before public rendering.
- Server-only Firebase Admin credentials are never imported into client components.

## Production deployment

Deploy the Next.js server to Vercel. Add all `.env.local` values to the Vercel project’s encrypted environment settings, including server-only Admin variables. Use `npm run build` as the build command; Vercel supplies the production runtime. Firebase remains responsible for Authentication, Firestore, Realtime Database, Storage, and their security rules. Cloud Functions are optional server-side Firebase workers and should be initialized only when a specific background task needs them.

After deployment, verify `/sitemap.xml`, `/robots.txt`, `/rss.xml`, article canonicals and JSON-LD, `/admin/login`, draft/scheduled visibility, Storage restrictions and Firestore rules in the Emulator Suite or Rules simulator.

## Project structure

```text
src/app/                  Next.js routes, metadata and route handlers
src/components/           Public, article and admin UI
src/lib/data.ts           Firebase-aware data access with demo fallback
src/lib/firebase/         Browser and server Firebase adapters
src/lib/seed-data.ts       Realistic local seed content
database.rules.json        Realtime Database security rules
firestore.rules            Firestore access control
storage.rules              Storage access control
firestore.indexes.json     Query indexes
scripts/seed.ts            Deterministic content seeder
```

## Verification

The project is configured to run `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:e2e`, and `npm run test:rules`. The browser suite covers public routes, admin editor/taxonomy surfaces, SEO feeds, mobile overflow/navigation, and a local Core Web Vitals budget check for LCP < 2.5 s, CLS < 0.1, and interaction events < 200 ms. Cloud deployment, authenticated Firebase behavior, and emulator rule execution require the user’s Firebase project, credentials, and Java runtime, which are deliberately not included in this repository.
