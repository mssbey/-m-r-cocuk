import { createHmac, timingSafeEqual } from "node:crypto";
const key = () =>
  process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
const signature = (src: string, kind: string, expires: string) =>
  createHmac("sha256", key())
    .update(`${src}\n${kind}\n${expires}`)
    .digest("hex");
export function uploadReceipt(src: string, kind: string) {
  if (!key()) throw new Error("Upload signing is not configured.");
  const expires = String(Date.now() + 60 * 60 * 1000);
  return `${expires}.${signature(src, kind, expires)}`;
}
export function validUploadReceipt(src: string, kind: string, token: unknown) {
  if (!key() || typeof token !== "string") return false;
  const [expires, digest, ...extra] = token.split(".");
  if (
    extra.length ||
    !/^\d+$/.test(expires) ||
    Number(expires) < Date.now() ||
    !/^[a-f0-9]{64}$/.test(digest || "")
  )
    return false;
  return timingSafeEqual(
    Buffer.from(digest, "hex"),
    Buffer.from(signature(src, kind, expires), "hex"),
  );
}
