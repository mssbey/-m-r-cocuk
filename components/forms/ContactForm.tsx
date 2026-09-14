"use client";

import { useState } from "react";
import Link from "next/link";
import { categories } from "@/lib/data/categories";
import { buildContactFormWhatsAppUrl } from "@/lib/whatsapp";

type FieldErrors = Record<string, string>;
type SubmitState = "idle" | "redirecting" | "error";

const PHONE_REGEX = /^[0-9+()\s-]{10,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(payload: {
  fullName: string;
  phone: string;
  email: string;
  message: string;
  kvkkConsent: boolean;
}): FieldErrors {
  const errors: FieldErrors = {};

  if (!payload.fullName || payload.fullName.trim().length < 3) {
    errors.fullName = "Lütfen ad soyad alanını eksiksiz doldurun.";
  }
  if (!payload.phone || !PHONE_REGEX.test(payload.phone.trim())) {
    errors.phone = "Lütfen geçerli bir telefon numarası girin.";
  }
  if (payload.email && !EMAIL_REGEX.test(payload.email.trim())) {
    errors.email = "Lütfen geçerli bir e-posta adresi girin.";
  }
  if (!payload.message || payload.message.trim().length < 10) {
    errors.message = "Mesajınızı en az 10 karakter olacak şekilde yazın.";
  }
  if (!payload.kvkkConsent) {
    errors.kvkkConsent = "Devam etmek için KVKK metnini onaylamanız gerekir.";
  }

  return errors;
}

export function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<SubmitState>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      category: String(formData.get("category") ?? ""),
      message: String(formData.get("message") ?? ""),
      kvkkConsent: formData.get("kvkkConsent") === "on",
    };

    const fieldErrors = validate(payload);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setState("error");
      setStatusMessage("Lütfen aşağıda işaretli alanları kontrol edin.");
      return;
    }

    setErrors({});

    const categoryLabel = categories.find((c) => c.slug === payload.category)?.name;
    const whatsappUrl = buildContactFormWhatsAppUrl({
      fullName: payload.fullName,
      phone: payload.phone,
      email: payload.email || undefined,
      category: categoryLabel ?? (payload.category === "diger" ? "Diğer" : undefined),
      message: payload.message,
    });

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setState("redirecting");
    setStatusMessage(
      "WhatsApp'a yönlendirildiniz. Açılan sohbette mesajınızı göndermeyi unutmayın — ekibimiz en kısa sürede dönüş yapacaktır."
    );
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {state === "redirecting" && statusMessage ? (
        <div
          role="status"
          className="rounded-2xl border border-brand-sand bg-[#FBF3E7] px-4 py-3 text-sm text-brand-navy"
        >
          {statusMessage}
        </div>
      ) : null}

      {state === "error" && statusMessage ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {statusMessage}
        </div>
      ) : null}

      <Field label="Ad Soyad" htmlFor="fullName" error={errors.fullName}>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          aria-invalid={Boolean(errors.fullName)}
          className={inputClass(Boolean(errors.fullName))}
        />
      </Field>

      <Field label="Telefon" htmlFor="phone" error={errors.phone}>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          placeholder="0 5xx xxx xx xx"
          aria-invalid={Boolean(errors.phone)}
          className={inputClass(Boolean(errors.phone))}
        />
      </Field>

      <Field label="E-posta (opsiyonel)" htmlFor="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          className={inputClass(Boolean(errors.email))}
        />
      </Field>

      <Field label="İlgilendiğiniz Kategori" htmlFor="category" error={errors.category}>
        <select id="category" name="category" className={inputClass(false)} defaultValue="">
          <option value="" disabled>
            Kategori seçin
          </option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
          <option value="diger">Diğer</option>
        </select>
      </Field>

      <Field label="Mesajınız" htmlFor="message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-invalid={Boolean(errors.message)}
          className={inputClass(Boolean(errors.message))}
        />
      </Field>

      <div>
        <label className="flex items-start gap-2.5 text-sm text-brand-gray">
          <input
            type="checkbox"
            name="kvkkConsent"
            required
            aria-invalid={Boolean(errors.kvkkConsent)}
            className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-brand-babyblue text-brand-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-navy"
          />
          <span>
            <Link href="/kvkk-aydinlatma-metni" className="underline underline-offset-2">
              KVKK Aydınlatma Metni
            </Link>
            &apos;ni okudum, kişisel verilerimin işlenmesini kabul ediyorum.
          </span>
        </label>
        {errors.kvkkConsent ? (
          <p className="mt-1.5 text-xs text-red-600">{errors.kvkkConsent}</p>
        ) : null}
      </div>

      <button
        type="submit"
        className="mt-2 rounded-full bg-brand-navy px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-brand-navy/90"
      >
        WhatsApp&apos;tan Gönder
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-brand-navy">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-navy ${
    hasError ? "border-red-400" : "border-brand-babyblue/50"
  }`;
}
