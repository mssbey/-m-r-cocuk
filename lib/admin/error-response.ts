import { CatalogError } from "./catalog-store";
import { GitHubApiError } from "./github";

export function adminErrorResponse(error: unknown, fallback: string) {
  if (error instanceof CatalogError)
    return Response.json({ error: error.message }, { status: error.status });
  // Keep provider details in server logs, never expose credentials to the UI.
  console.error("Admin storage failed", error);
  let message = fallback;
  if (error instanceof GitHubApiError) {
    if (error.status === 401)
      message = "GitHub kayıt anahtarı geçersiz veya süresi dolmuş. Sunucudaki GITHUB_TOKEN değerini güncelleyin.";
    else if (error.status === 403)
      message = "GitHub kayıt izni reddedildi. GITHUB_TOKEN için bu depoda Contents: Read and write izni gerekir.";
    else if (error.status === 404)
      message = "GitHub deposu veya kayıt yolu bulunamadı. Depo, dal ve GITHUB_TOKEN erişimini kontrol edin.";
  }
  return Response.json({ error: message }, { status: 502 });
}
