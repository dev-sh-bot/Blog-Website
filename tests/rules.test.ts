import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, test } from "node:test";
import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from "@firebase/rules-unit-testing";

let environment: RulesTestEnvironment;

before(async () => {
  environment = await initializeTestEnvironment({
    projectId: "demo-insightly",
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
    storage: { rules: readFileSync("storage.rules", "utf8") },
  });
  await environment.clearFirestore();
  await environment.clearStorage();
  await environment.withSecurityRulesDisabled(async (context) => {
    await context.firestore().collection("admins").doc("admin-uid").set({ active: true, role: "admin" });
    await context.firestore().collection("posts").doc("published").set({ status: "published", publishedAt: new Date(Date.now() - 60_000) });
    await context.firestore().collection("posts").doc("scheduled-past").set({ status: "scheduled", publishedAt: new Date(Date.now() - 60_000) });
    await context.firestore().collection("posts").doc("scheduled-future").set({ status: "scheduled", publishedAt: new Date(Date.now() + 60_000) });
    await context.firestore().collection("posts").doc("draft").set({ status: "draft", publishedAt: new Date(Date.now() - 60_000) });
    await context.firestore().collection("settings").doc("site").set({ siteName: "Private" });
    await context.firestore().collection("settings").doc("public").set({ siteName: "Public" });
    await context.firestore().collection("subscribers").doc("subscriber").set({ email: "reader@example.com" });
    await context.firestore().collection("media").doc("private-media").set({ path: "media/public/rules-test.jpg" });
    await context.firestore().collection("admins").doc("inactive-uid").set({ active: false, role: "admin" });
  });
});

after(async () => { await environment.cleanup(); });

test("public readers can read published posts but not drafts", async () => {
  const publicContext = environment.unauthenticatedContext();
  await assertSucceeds(publicContext.firestore().collection("posts").doc("published").get());
  await assertFails(publicContext.firestore().collection("posts").doc("scheduled-past").get());
  await assertFails(publicContext.firestore().collection("posts").doc("scheduled-future").get());
  await assertFails(publicContext.firestore().collection("posts").doc("draft").get());
});

test("only active admins can mutate posts", async () => {
  const visitor = environment.authenticatedContext("visitor");
  const admin = environment.authenticatedContext("admin-uid");
  const inactiveAdmin = environment.authenticatedContext("inactive-uid");
  await assertFails(visitor.firestore().collection("posts").doc("published").update({ title: "Nope" }));
  await assertSucceeds(admin.firestore().collection("posts").doc("published").update({ title: "Updated" }));
  await assertFails(inactiveAdmin.firestore().collection("posts").doc("published").update({ title: "Nope" }));
});

test("private collections are not public", async () => {
  const publicContext = environment.unauthenticatedContext();
  await assertFails(publicContext.firestore().collection("settings").doc("site").get());
  await assertSucceeds(publicContext.firestore().collection("settings").doc("public").get());
  await assertFails(publicContext.firestore().collection("subscribers").doc("subscriber").get());
  await assertFails(publicContext.firestore().collection("media").doc("private-media").get());
});

test("administrator allowlist writes stay behind the server API", async () => {
  const manager = environment.authenticatedContext("admin-uid");
  await assertSucceeds(manager.firestore().collection("admins").doc("admin-uid").get());
  await assertFails(manager.firestore().collection("admins").doc("new-admin").set({ active: true, role: "editor" }));
});

test("Storage accepts only authorized image writes", async () => {
  const visitor = environment.unauthenticatedContext();
  const file = visitor.storage("gs://demo-insightly.appspot.com").ref("media/editor/test.jpg");
  const upload = new Promise<void>((resolve, reject) => { const task = file.put(Buffer.from("not a real image"), { contentType: "image/jpeg" }); task.on("state_changed", () => undefined, reject, resolve); });
  await assertFails(upload);
  assert.ok(file);
  const admin = environment.authenticatedContext("admin-uid");
  const publicFile = admin.storage("gs://demo-insightly.appspot.com").ref("media/public/rules-test.jpg");
  const adminUpload = new Promise<void>((resolve, reject) => { const task = publicFile.put(Buffer.from("test image bytes"), { contentType: "image/jpeg" }); task.on("state_changed", () => undefined, reject, resolve); });
  await assertSucceeds(adminUpload);
  await assertSucceeds(visitor.storage("gs://demo-insightly.appspot.com").ref("media/public/rules-test.jpg").getMetadata());
  await assertFails(visitor.storage("gs://demo-insightly.appspot.com").ref("media/editor/admin-uid/rules-test.jpg").getMetadata());
  await assertSucceeds(publicFile.delete());
});
