/**
 * GitHub Contents API üzerinden repo dosyalarını okuma/yazma.
 *
 * Vercel'in sunucusuz fonksiyonlarında kalıcı disk yok — bu yüzden admin
 * paneli değişiklikleri doğrudan diske değil, GitHub reposuna commit
 * olarak yazar. Repo `main`'e her push Vercel'de otomatik yeniden
 * deploy tetikler, yani kaydedilen değişiklik ~30-60 saniye içinde
 * canlı siteye yansır.
 */

const OWNER = process.env.GITHUB_OWNER || "mssbey";
const REPO = process.env.GITHUB_REPO || "-m-r-cocuk";
const BRANCH = process.env.GITHUB_BRANCH || "main";

function apiHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN ortam değişkeni tanımlı değil.");
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function contentsUrl(path: string) {
  return `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
}

export class GitHubApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function githubFetch(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: { ...apiHeaders(), ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new GitHubApiError(`GitHub API hatası (${res.status}): ${body}`, res.status);
  }
  return res;
}

export type RepoFile = { content: string; sha: string };

/** Metin dosyası oku (UTF-8). Yoksa null döner. */
export async function readTextFile(path: string): Promise<RepoFile | null> {
  try {
    const res = await githubFetch(`${contentsUrl(path)}?ref=${BRANCH}`);
    const json = (await res.json()) as { content: string; sha: string; encoding: string };
    const content = Buffer.from(json.content, "base64").toString("utf8");
    return { content, sha: json.sha };
  } catch (e) {
    if (e instanceof GitHubApiError && e.status === 404) return null;
    throw e;
  }
}

/** Dosyanın yalnızca sha'sını al (silme/güncelleme için gerekli). */
export async function getFileSha(path: string): Promise<string | null> {
  try {
    const res = await githubFetch(`${contentsUrl(path)}?ref=${BRANCH}`);
    const json = (await res.json()) as { sha: string };
    return json.sha;
  } catch (e) {
    if (e instanceof GitHubApiError && e.status === 404) return null;
    throw e;
  }
}

/** Metin veya binary dosyayı oluştur/güncelle. */
export async function writeFile(
  path: string,
  content: string | Buffer,
  message: string,
  sha?: string | null
): Promise<{ sha: string }> {
  const base64 = Buffer.isBuffer(content) ? content.toString("base64") : Buffer.from(content, "utf8").toString("base64");
  const res = await githubFetch(contentsUrl(path), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: base64,
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
  const json = (await res.json()) as { content: { sha: string } };
  return { sha: json.content.sha };
}

/** Dosyayı sil. */
export async function deleteFile(path: string, sha: string, message: string): Promise<void> {
  await githubFetch(contentsUrl(path), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sha, branch: BRANCH }),
  });
}

export async function readJsonFile<T>(path: string): Promise<{ data: T; sha: string }> {
  const file = await readTextFile(path);
  if (!file) throw new Error(`${path} bulunamadı.`);
  return { data: JSON.parse(file.content) as T, sha: file.sha };
}

export async function writeJsonFile(path: string, data: unknown, message: string, sha: string): Promise<{ sha: string }> {
  return writeFile(path, JSON.stringify(data, null, 2) + "\n", message, sha);
}
