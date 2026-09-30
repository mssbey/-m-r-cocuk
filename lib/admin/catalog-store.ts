import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { githubFetch } from "./github";
import type { Catalog } from "./catalog-types";
export const catalogPaths = {
  products: "lib/data/products.json",
  categories: "lib/data/categories.json",
  collections: "lib/data/collection-groups.json",
  gallery: "lib/data/gallery.json",
} as const;
const base = () =>
  `https://api.github.com/repos/${process.env.GITHUB_OWNER || "mssbey"}/${process.env.GITHUB_REPO || "-m-r-cocuk"}`;
const branch = () => process.env.GITHUB_BRANCH || "main";
// Explicit, isolated filesystem storage is for development and acceptance tests only.
const localDir = () =>
  process.env.NODE_ENV !== "production"
    ? process.env.ADMIN_DATA_DIR
    : undefined;
export class CatalogError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export async function readCatalog(): Promise<Catalog> {
  const dir = localDir();
  if (dir)
    return JSON.parse(
      await fs.readFile(path.join(dir, "catalog.json"), "utf8"),
    );
  const head = await (
    await githubFetch(`${base()}/git/ref/heads/${branch()}`)
  ).json();
  const revision = head.object.sha as string;
  const entries = await Promise.all(
    Object.entries(catalogPaths).map(async ([key, p]) => {
      const res = await githubFetch(`${base()}/contents/${p}?ref=${revision}`);
      const body = await res.json();
      return [
        key,
        JSON.parse(Buffer.from(body.content, "base64").toString("utf8")),
      ];
    }),
  );
  return { ...Object.fromEntries(entries), revision } as Catalog;
}
export async function saveCatalog(
  catalog: Catalog,
  expected: string,
  uploads: { path: string; content: Buffer }[] = [],
) {
  const dir = localDir();
  if (dir) {
    const lock = await fs
      .open(path.join(dir, "catalog.lock"), "wx")
      .catch(() => {
        throw new CatalogError("Başka bir kayıt sürüyor. Tekrar deneyin.", 409);
      });
    try {
      const current = await readCatalog();
      if (current.revision !== expected)
        throw new CatalogError(
          "Liste değişmiş. Sayfayı yenileyip tekrar deneyin.",
          409,
        );
      catalog.revision = randomUUID();
      for (const upload of uploads) {
        const target = path.join(dir, upload.path);
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.writeFile(target, upload.content);
      }
      const tmp = path.join(dir, "catalog.tmp");
      await fs.writeFile(tmp, JSON.stringify(catalog, null, 2));
      await fs.rename(tmp, path.join(dir, "catalog.json"));
    } finally {
      await lock.close();
      await fs.unlink(path.join(dir, "catalog.lock"));
    }
    return;
  }
  // Every read uses the same immutable commit. A non-fast-forward update rejects
  // concurrent edits; category slug + product references publish in one commit.
  const head = await (
    await githubFetch(`${base()}/git/ref/heads/${branch()}`)
  ).json();
  if (head.object.sha !== expected)
    throw new CatalogError(
      "Liste değişmiş. Sayfayı yenileyip tekrar deneyin.",
      409,
    );
  const commit = await (
    await githubFetch(`${base()}/git/commits/${expected}`)
  ).json();
  const post = async (suffix: string, body: unknown) =>
    (
      await githubFetch(`${base()}/git/${suffix}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    ).json();
  const uploadTree = await Promise.all(
    uploads.map(async (upload) => ({
      path: upload.path,
      mode: "100644",
      type: "blob",
      sha: (
        await post("blobs", {
          content: upload.content.toString("base64"),
          encoding: "base64",
        })
      ).sha,
    })),
  );
  const tree = await post("trees", {
    base_tree: commit.tree.sha,
    tree: [
      ...Object.entries(catalogPaths).map(([key, p]) => ({
        path: p,
        mode: "100644",
        type: "blob",
        content:
          JSON.stringify(catalog[key as keyof typeof catalogPaths], null, 2) +
          "\n",
      })),
      ...uploadTree,
    ],
  });
  const next = await post("commits", {
    message: "admin: katalog güncellendi",
    tree: tree.sha,
    parents: [expected],
  });
  try {
    await githubFetch(`${base()}/git/refs/heads/${branch()}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sha: next.sha, force: false }),
    });
  } catch {
    throw new CatalogError(
      "Liste değişmiş veya kayıt tamamlanamadı. Sayfayı yenileyip tekrar deneyin.",
      409,
    );
  }
  catalog.revision = next.sha;
}
