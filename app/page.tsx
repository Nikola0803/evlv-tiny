import Link from "next/link";
import { ArrowRight, CalendarDays, Dna, Leaf, PawPrint } from "lucide-react";

const brands = [
  { name: "EVLV Peptides", descriptor: "Research Peptides & Laboratory Supplies", action: "Explore Research Products", href: "https://evlvpeptides.com", className: "brand-card peptides", icon: Dna, mark: "EVLV" },
  { name: "EVLV Today", descriptor: "Wellness Optimisation", action: "Discover EVLV Today", href: "https://evlvtoday.com", className: "brand-card today", icon: Leaf, mark: "EVLV TODAY" },
  { name: "ZooNetics", descriptor: "Pet Peptides & Research", action: "Explore ZooNetics", href: "https://zoonetics.co", className: "brand-card zoonetics", icon: PawPrint, mark: "ZOONETICS" },
];

const utilityLinks = [
  ["COAs", "https://evlvpeptides.com/coas"],
  ["Reviews", "https://verifiedpeptidereviews.com/vendors/evlv-peptides"],
  ["Wholesale", "https://evlvpeptides.com/wholesale"],
  ["Contact", "/contact"],
];

export default function Home() {
  return (
    <main className="hub-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <section className="hub-wrap" aria-labelledby="hub-title">
        <header className="hub-header">
          <img className="evlv-logo" src="/logo/evlv-logo-light.png" alt="EVLV" />
          <p className="eyebrow">The EVLV ecosystem</p>
          <h1 id="hub-title">Choose your path.</h1>
          <p className="intro">Research, wellness, and animal care—three focused brands, one standard.</p>
        </header>
        <div className="brand-grid">
          {brands.map(({ icon: Icon, ...brand }) => (
            <a key={brand.name} href={brand.href} className={brand.className} rel="noreferrer">
              <div className="brand-card-top"><span className="brand-icon"><Icon size={18} strokeWidth={1.7} /></span><span className="brand-mark">{brand.mark}</span></div>
              <div><h2 className={brand.name === "ZooNetics" ? "zoonetics-title" : undefined}>{brand.name}{brand.name === "ZooNetics" && <small>by EVLV</small>}</h2><p>{brand.descriptor}</p></div>
              <span className="brand-action">{brand.action}<ArrowRight size={17} /></span>
            </a>
          ))}
        </div>
        <Link href="/book" className="booking-cta">
          <span className="booking-icon"><CalendarDays size={20} /></span>
          <span><strong>Schedule a call</strong><small>Choose a time that works for you</small></span>
          <ArrowRight className="booking-arrow" size={19} />
        </Link>
        <nav className="utility-links" aria-label="More EVLV links">{utilityLinks.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav>
        <footer><span>EVLV</span><span className="footer-rule" /><span>Built for better decisions.</span></footer>
      </section>
    </main>
  );
}
