import { spawnSync } from "node:child_process";

const result = spawnSync("java", ["-version"], { encoding: "utf8" });
const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
const versionMatch = output.match(/version\s+"(\d+)(?:\.(\d+))?/i);
const majorVersion = versionMatch ? Number(versionMatch[1] === "1" ? versionMatch[2] : versionMatch[1]) : 0;
if (result.error || result.status !== 0 || !Number.isFinite(majorVersion) || majorVersion < 11) {
  console.error("Java 11 or newer is required for the Firebase Firestore/Storage Emulator Suite. Install Java, ensure `java` is on PATH, then rerun this command.");
  process.exit(1);
}
