"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { categories } from "@/lib/data/categories";
import { primaryNav } from "@/lib/nav";
import { useFavorites } from "@/hooks/useFavorites";
import { siteConfig } from "@/lib/config";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const { favoriteIds } = useFavorites();
  const router = useRouter();
  return <header className="shop-header">
    <div className="shop-topbar"><div className="container-brand"><span>BEBEKLİKTEN GENÇLİĞE, BİR ÖMÜR BERABER.</span><div><Link href="/magazalarimiz">Mağazalarımız</Link><Link href="/sss">Sıkça sorulan sorular</Link><a href={siteConfig.contact.phoneHref}>{siteConfig.contact.phoneDisplay}</a></div></div></div>
    <div className="container-brand shop-mainbar">
      <button className="shop-mobile-toggle" aria-label="Menüyü aç" onClick={() => setMobileOpen(true)}>☰</button>
      <Logo priority className="shop-header-logo" />
      <form className="shop-search" role="search" onSubmit={e => { e.preventDefault(); router.push(`${category ? `/${category}` : '/urunler'}?q=${encodeURIComponent(query.trim())}`); }}>
        <input aria-label="Ürün ara" placeholder="Ürün arayın…" value={query} onChange={e => setQuery(e.target.value)} />
        <select aria-label="Arama kategorisi" value={category} onChange={e => setCategory(e.target.value)}><option value="">Tüm kategoriler</option>{categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
        <button aria-label="Ara" type="submit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 6 6"/></svg></button>
      </form>
      <div className="shop-actions"><Link href="/iletisim" className="shop-contact-link">BİZE ULAŞIN</Link><Link href="/favorilerim" aria-label={`Favorilerim, ${favoriteIds.length} ürün`} className="shop-heart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21 3.5 12.5C-3 5.5 6-1 12 6c6-7 15-.5 8.5 6.5Z"/></svg><span>{favoriteIds.length}</span></Link></div>
    </div>
    <div className="shop-navline"><div className="container-brand shop-navinner">
      <div className="shop-category-menu" onKeyDown={e => { if (e.key === 'Escape') setCategoryOpen(false); }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setCategoryOpen(false); }}>
        <button aria-expanded={categoryOpen} aria-controls="header-categories" onClick={() => setCategoryOpen(!categoryOpen)}><span>☰</span> TÜM KATEGORİLER <span>⌄</span></button>
        {categoryOpen && <div id="header-categories" className="shop-category-dropdown">{categories.map(c => <Link href={`/${c.slug}`} key={c.slug} onClick={() => setCategoryOpen(false)}>{c.name}<span>›</span></Link>)}</div>}
      </div>
      <nav aria-label="Ana site navigasyonu">{primaryNav.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}<Link href="/iletisim">İletişim</Link></nav>
      <Link className="shop-nav-promo" href="/kampanyali-urunler">GÜNCEL FIRSATLAR</Link>
    </div></div>
    <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
  </header>;
}
