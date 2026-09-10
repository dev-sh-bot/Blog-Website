import type { PostStatus } from "./types";

/** Explicit publishing makes an article visible now; future dates belong to scheduled posts. */
export function resolvePublicationDate(status: PostStatus, requested: Date, now = new Date()) {
  const requestedTime = requested.getTime();
  if (status === "published" && (!Number.isFinite(requestedTime) || requestedTime > now.getTime())) return now;
  return requested;
}
