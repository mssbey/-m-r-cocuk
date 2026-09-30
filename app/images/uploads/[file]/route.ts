import { promises as fs } from "node:fs";
import path from "node:path";
import { githubFetch } from "@/lib/admin/github";
export const runtime = "nodejs";
// Only generated upload names can be read; repository paths and tokens stay private.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  if (!/^[a-f0-9-]{36}\.webp$/.test(file))
    return new Response(null, { status: 404 });
  try {
    let buffer: Buffer;
    if (process.env.NODE_ENV !== "production" && process.env.ADMIN_DATA_DIR)
      buffer = await fs.readFile(
        path.join(process.env.ADMIN_DATA_DIR, "public/images/uploads", file),
      );
    else {
      const owner = process.env.GITHUB_OWNER || "mssbey",
        repo = process.env.GITHUB_REPO || "-m-r-cocuk",
        branch = process.env.GITHUB_BRANCH || "main";
      const res = await githubFetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/public/images/uploads/${file}?ref=${branch}`,
        { headers: { Accept: "application/vnd.github.raw+json" } },
      );
      buffer = Buffer.from(await res.arrayBuffer());
    }
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
