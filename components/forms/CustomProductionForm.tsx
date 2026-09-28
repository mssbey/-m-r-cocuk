"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import {
  buildCustomRequestMessage,
  validateReferenceFiles,
} from "@/lib/custom-request";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/config";

type Reference = { file: File; url: string; id: string };
type Prepared = { id: string; text: string; files: File[] };

export function CustomProductionForm({
  product = "",
  fabric = "",
}: {
  product?: string;
  fabric?: string;
}) {
  const [references, setReferences] = useState<Reference[]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [prepared, setPrepared] = useState<Prepared | null>(null);
  const [sharing, setSharing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileSharing, setFileSharing] = useState(false);
  const urls = useRef(new Set<string>());
  const summary = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const current = urls.current;
    return () => current.forEach((url) => URL.revokeObjectURL(url));
  }, []);
  useEffect(() => {
    if (prepared) summary.current?.focus();
  }, [prepared]);

  function invalidate() {
    setPrepared(null);
    setStatus("");
    setError("");
  }
  async function addFiles(files: File[]) {
    invalidate();
    const combined = [...references.map((item) => item.file), ...files];
    const validation = validateReferenceFiles(combined);
    if (validation) {
      setError(validation);
      return;
    }
    setLoading(true);
    const added: Reference[] = [];
    try {
      for (const file of files) {
        const url = URL.createObjectURL(file);
        urls.current.add(url);
        added.push({ file, url, id: crypto.randomUUID() });
        // Decode before accepting a file so corrupt or mislabeled images cannot
        // leave broken previews in a customer's request.
        await new Promise<void>((resolve, reject) => {
          const image = new window.Image();
          image.onload = () => resolve();
          image.onerror = () =>
            reject(
              new Error(
                "Görsel açılamadı. Geçerli bir JPG, PNG veya WebP dosyası seçin.",
              ),
            );
          image.src = url;
        });
      }
      setReferences((previous) => [...previous, ...added]);
    } catch (error) {
      added.forEach((item) => {
        URL.revokeObjectURL(item.url);
        urls.current.delete(item.url);
      });
      setError(error instanceof Error ? error.message : "Görseller okunamadı.");
    } finally {
      setLoading(false);
    }
  }
  function removeReference(id: string) {
    invalidate();
    setReferences((previous) =>
      previous.filter((item) => {
        if (item.id !== id) return true;
        URL.revokeObjectURL(item.url);
        urls.current.delete(item.url);
        return false;
      }),
    );
  }
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fields = {
      name: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      product: String(data.get("product") ?? "").trim(),
      dimensions: String(data.get("dimensions") ?? "").trim(),
      fabric: String(data.get("fabric") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };
    if (
      fields.name.length < 3 ||
      fields.phone.replace(/\D/g, "").length < 10 ||
      fields.message.length < 10
    ) {
      setError(
        "Ad soyadınızı, geçerli telefon numaranızı ve en az 10 karakterlik talebinizi girin.",
      );
      return;
    }
    if (!data.get("consent")) {
      setError(
        "Devam etmek için aydınlatma metnini okuyup paylaşım tercihinizi onaylayın.",
      );
      return;
    }
    const id = `OMR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const files = references.map((item) => item.file);
    setPrepared({
      id,
      text: buildCustomRequestMessage(
        fields,
        id,
        files.map((file) => file.name),
      ),
      files,
    });
    setFileSharing(
      Boolean(
        files.length && navigator.canShare?.({ files }) && navigator.share,
      ),
    );
    setError("");
    setStatus("");
  }
  async function share() {
    if (!prepared || sharing) return;
    setSharing(true);
    setStatus("");
    try {
      await navigator.share({
        title: `Ömür Çocuk · ${prepared.id}`,
        text: prepared.text,
        files: prepared.files,
      });
      setStatus(
        "Paylaşım ekranı açıldı. WhatsApp’ta Ömür Çocuk sohbetini seçip mesaj ve görsellerinizi kontrol ederek gönderin.",
      );
    } catch (error) {
      setStatus(
        error instanceof Error && error.name === "AbortError"
          ? "Paylaşım iptal edildi. Talebiniz ve görselleriniz burada duruyor."
          : "Bu cihazda görseller paylaşılamadı. Hazır mesajı WhatsApp’ta açıp aşağıdaki görselleri aynı sohbete ekleyebilirsiniz.",
      );
    } finally {
      setSharing(false);
    }
  }
  async function copyMessage() {
    if (!prepared) return;
    try {
      await navigator.clipboard.writeText(prepared.text);
      setStatus("Talep metni kopyalandı.");
    } catch {
      setStatus(
        "Kopyalama desteklenmiyor. Aşağıdaki metni seçip kopyalayabilirsiniz.",
      );
    }
  }

  return (
    <form
      className="custom-form"
      onSubmit={prepare}
      onChange={() => {
        if (prepared) invalidate();
      }}
    >
      <fieldset disabled={sharing || loading} className="custom-fields">
        <div className="form-two-columns">
          <label>
            Ad Soyad
            <input
              name="name"
              required
              minLength={3}
              maxLength={100}
              autoComplete="name"
            />
          </label>
          <label>
            Telefon
            <input
              name="phone"
              type="tel"
              required
              maxLength={25}
              autoComplete="tel"
              placeholder="0 5xx xxx xx xx"
            />
          </label>
        </div>
        <label>
          Ürün / İstediğiniz Tasarım
          <input
            name="product"
            defaultValue={product}
            maxLength={200}
            placeholder="Örneğin: Montessori yatak"
          />
        </label>
        <div className="form-two-columns">
          <label>
            Ölçüler (isteğe bağlı)
            <input
              name="dimensions"
              maxLength={150}
              placeholder="En × boy × yükseklik, cm"
            />
          </label>
          <label>
            Kumaş / Renk Tercihi
            <input
              name="fabric"
              defaultValue={fabric}
              maxLength={150}
              placeholder="Kumaş ve renk adı"
            />
          </label>
        </div>
        <Link className="flow-text-link" href="/kumas-renk-kartelasi">
          Kumaş seçeneklerini incele →
        </Link>
        <label>
          Tasarımınızdan Bahsedin
          <textarea
            name="message"
            rows={5}
            minLength={10}
            maxLength={2000}
            required
            placeholder="İhtiyaçlarınız, renk tercihleriniz ve önemli detaylar…"
          />
        </label>
        <div className="reference-upload">
          <label htmlFor="reference-files">
            Ürün görseli / Referans görseli
          </label>
          <p id="reference-help">
            Beğendiğiniz ürünün veya istediğiniz tasarımın görselini yükleyin.
            Ürün fotoğrafı, tasarım veya kendi çiziminizi ekleyebilirsiniz.
          </p>
          <label className="reference-dropzone" htmlFor="reference-files">
            <span aria-hidden="true">＋</span>
            <strong>Görselleri seçin</strong>
            <span>En fazla 6 görsel · JPG, PNG, WebP · Dosya başına 8 MB</span>
            <input
              id="reference-files"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              aria-describedby="reference-help"
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                event.target.value = "";
                void addFiles(files);
              }}
            />
          </label>
          {loading && <p role="status">Görseller hazırlanıyor…</p>}
          {references.length > 0 && (
            <div className="reference-previews">
              {references.map((item, index) => (
                <figure key={item.id}>
                  <div>
                    <Image
                      src={item.url}
                      alt={`Referans ${index + 1}: ${item.file.name}`}
                      fill
                      unoptimized
                      sizes="150px"
                    />
                  </div>
                  <figcaption>{item.file.name}</figcaption>
                  <button
                    type="button"
                    aria-label={`${item.file.name} görselini kaldır`}
                    onClick={() => removeReference(item.id)}
                  >
                    ×
                  </button>
                </figure>
              ))}
            </div>
          )}
          <p className="form-note">
            Görseller ve form bilgileriniz siz paylaşana kadar bu cihazda kalır.
            Talep hazırlanması, gönderildiği anlamına gelmez.
          </p>
        </div>
        <label className="reference-consent">
          <input type="checkbox" name="consent" required />
          <span>
            <Link href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</Link>’ni
            okudum; talebimi ve seçtiğim görselleri Ömür Çocuk ile paylaşmak
            istiyorum.
          </span>
        </label>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <button className="shop-button" type="submit">
          Talebi Hazırla
        </button>
      </fieldset>
      {prepared && (
        <div ref={summary} tabIndex={-1} className="request-summary">
          <p className="shop-eyebrow">{prepared.id}</p>
          <h2>Talebiniz paylaşılmaya hazır.</h2>
          <p>Alıcı: Ömür Çocuk · {siteConfig.contact.phoneDisplay}</p>
          <textarea
            aria-label="Hazırlanan talep mesajı"
            value={prepared.text}
            readOnly
            rows={10}
          />
          {prepared.files.length > 0 && (
            <p>
              {fileSharing
                ? "Görsellerle paylaş butonuna dokunun; açılan paylaşım ekranında WhatsApp’ı ve Ömür Çocuk sohbetini seçin."
                : "Bu cihazda görseller doğrudan aktarılamıyor. Hazır mesajı WhatsApp’ta açın, seçtiğiniz görselleri ataç / + düğmesinden aynı sohbete ekleyin."}
            </p>
          )}
          <div className="flow-actions">
            {fileSharing && (
              <button
                type="button"
                className="shop-button"
                disabled={sharing}
                onClick={share}
              >
                {sharing ? "Paylaşım açılıyor…" : "Görsellerle Paylaş"}
              </button>
            )}
            <a
              className={fileSharing ? "shop-outline-button" : "shop-button"}
              href={buildWhatsAppUrl(prepared.text)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Hazır Mesajı WhatsApp’ta Aç
            </a>
            <button
              type="button"
              className="flow-text-link"
              onClick={copyMessage}
            >
              Metni kopyala
            </button>
          </div>
          {references.length > 0 && (
            <ul className="reference-downloads">
              {references.map((item) => (
                <li key={item.id}>
                  <a href={item.url} download={item.file.name}>
                    {item.file.name} · İndir
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {status && (
        <p role="status" className="form-status">
          {status}
        </p>
      )}
    </form>
  );
}
