"use client";
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="admin-fields">
      <h1 className="admin-heading">Veriler yüklenemedi.</h1>
      <p role="alert">
        Bağlantıyı kontrol edip tekrar deneyin. Girdiğiniz son değişiklik
        kaydedilmemiş olabilir.
      </p>
      <div>
        <button className="admin-button" onClick={reset}>
          Tekrar dene
        </button>
      </div>
    </div>
  );
}
