import Link from "next/link";
import { ArrowRight, CalendarDays, Dna, Leaf, PawPrint } from "lucide-react";
import NewsletterSignup from "./newsletter-signup";

const brands = [
  { name: "EVLV Today", descriptor: "Wellness Optimisation & Pep Talk", action: "Explore EVLV Today", href: "https://evlvtoday.com", className: "brand-card today", icon: Leaf, mark: "START HERE" },
  { name: "EVLV Peptides", descriptor: "Shop Research Peptides & Laboratory Supplies", action: "Shop Research Peptides", href: "https://evlvpeptides.com", className: "brand-card peptides", icon: Dna, mark: "EVLV" },
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
          <p className="eyebrow">EVLV Today • Pep Talk</p>
          <h1 id="hub-title">A real answer, in 15 minutes.</h1>
          <p className="intro">Bring the wellness question you cannot get a straight answer on. We will help you understand it and decide what to do next.</p>
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
          <span><strong>Book a free Pep Talk</strong><small>15 minutes with the EVLV Today wellness team</small></span>
          <ArrowRight className="booking-arrow" size={19} />
        </Link>
        <div className="pep-talk-note"><strong>Bring the question.</strong><span>A symptom, a protocol, or something you read about peptides. We give clear wellness guidance and say when a physician is the right next step.</span></div>
        <NewsletterSignup />
        <nav className="utility-links" aria-label="More EVLV links">{utilityLinks.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav>
        <footer>
          <span>EVLV</span><span className="footer-rule" /><span>Built for better decisions.</span>
          <div className="footer-contact">
            <a href="tel:+15417095434">(541) 709-5434</a>
            <span className="footer-rule" />
            <a href="mailto:office@evlvpeptides.com">office@evlvpeptides.com</a>
            <span className="footer-rule" />
            <a href="mailto:orders@evlvpeptides.com">orders@evlvpeptides.com</a>
          </div>
        </footer>
      </section>
    </main>
  );
}
