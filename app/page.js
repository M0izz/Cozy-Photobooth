'use client';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import styles from './page.module.css';

// Floating polaroids config
const POLAROIDS = [
    { rotate: -5, emoji: '🌅', label: 'golden hour', color: '#FFF8E7', delay: '0s' },
    { rotate: 3, emoji: '🎞️', label: 'film grain', color: '#F0F0F0', delay: '0.8s' },
    { rotate: -2, emoji: '🌿', label: 'soft greens', color: '#EDF5E8', delay: '1.4s' },
    { rotate: 6, emoji: '🌙', label: 'midnight', color: '#EAEAF2', delay: '0.3s' },
];

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const stampRef = useRef(null);

    useEffect(() => { setMounted(true); }, []);

    const handleStamp = () => {
        if (stampRef.current) {
            stampRef.current.style.animation = 'none';
            stampRef.current.offsetHeight; // reflow
            stampRef.current.style.animation = 'stampIn 0.5s forwards';
        }
    };

    return (
        <main className={styles.main}>
            {/* ── Navbar ── */}
            <nav className={styles.navbar}>
                <Link href="/" className={styles.navLogo}>Cozy Booth ✂️</Link>
                <div className={styles.navLinks}>
                    <Link href="/solo" className={styles.navItem}>Create</Link>
                    <Link href="/duo" className={styles.navItem}>Duo Mode</Link>
                </div>
                <Link href="/solo" className={`${styles.navCta} btn-primary`}>📸 Start Free</Link>
            </nav>

            {/* ── Hero ── */}
            <section className={styles.hero}>
                <div className={styles.heroBadge}>
                    <span className={styles.recDot} /> Free · No login · No watermark
                </div>

                <h1 className={styles.heroTitle}>
                    Keep things sketchy.<br />Keep things real.<br />
                    <span className={styles.heroTitleAccent}>Make Memories.</span>
                </h1>

                <p className={styles.heroSub}>
                    A cozy browser-based photobooth with 19+ film filters,<br />
                    7 layouts, and real-time duo capture — all free.
                </p>

                <div className={styles.heroCtas}>
                    <Link href="/solo" className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 36px' }}>
                        📸 Take a Picture
                    </Link>
                    <Link href="/duo" className="btn-secondary" style={{ fontSize: '1.1rem', padding: '15px 34px' }}>
                        🔗 Go Live Together
                    </Link>
                </div>

                {/* Floating polaroids */}
                {mounted && (
                    <div className={styles.polaroidCloud} aria-hidden>
                        {POLAROIDS.map((p, i) => (
                            <div key={i} className={styles.polaroidFloat} style={{ '--rot': `${p.rotate}deg`, '--delay': p.delay }} >
                                <div className={styles.polaroidInner} style={{ background: p.color }}>
                                    <span className={styles.polaroidEmoji}>{p.emoji}</span>
                                </div>
                                <p className={styles.polaroidLabel}>{p.label}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ── Step strip ── */}
            <section className={styles.steps}>
                <div className="page-wrapper">
                    <h2 className={styles.sectionTitle}>How it works ✨</h2>
                    <div className={styles.stepsGrid}>
                        {[
                            ['01', '🎯', 'Choose a Layout', 'Polaroid, strip, collage — pick your vibe'],
                            ['02', '🎞️', 'Apply a Filter', '19+ handcrafted film & cozy filters'],
                            ['03', '📸', 'Strike a Pose', 'Auto 3-2-1 countdown captures every shot'],
                            ['04', '📥', 'Download Free', 'High-res PNG, no login, no watermark'],
                        ].map(([num, icon, title, desc]) => (
                            <div key={num} className={styles.stepCard}>
                                <span className={styles.stepNum}>{num}</span>
                                <span className={styles.stepIcon}>{icon}</span>
                                <h3 className={styles.stepTitle}>{title}</h3>
                                <p className={styles.stepDesc}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Mode cards ── */}
            <section className={styles.modes}>
                <div className="page-wrapper">
                    <h2 className={styles.sectionTitle}>Two ways to create 📷</h2>
                    <div className={styles.modeGrid}>

                        {/* Solo */}
                        <div className={styles.modeCard}>
                            <div className={styles.modeCardTop} style={{ background: '#FFF8E7' }}>
                                <span className={styles.modeBigIcon}>📸</span>
                                <div className={styles.modeStamp} ref={stampRef} onClick={handleStamp}>SOLO</div>
                            </div>
                            <div className={styles.modeCardBody}>
                                <h2 className={styles.modeTitle}>Solo Booth</h2>
                                <p className={styles.modeDesc}>
                                    Live camera, real-time filters, multi-shot strip — capture your vibe and download instantly.
                                </p>
                                <ul className={styles.modeFeatures}>
                                    {['🎞️ 19+ film filters', '🖼️ 7 layouts', '✍️ Custom captions & stickers', '📥 Instant download'].map(f => (
                                        <li key={f}>{f}</li>
                                    ))}
                                </ul>
                                <Link href="/solo" className="btn-primary" style={{ marginTop: '20px' }}>
                                    Start Solo →
                                </Link>
                            </div>
                        </div>

                        {/* Duo */}
                        <div className={styles.modeCard}>
                            <div className={styles.modeCardTop} style={{ background: '#EDF5E8' }}>
                                <span className={styles.modeBigIcon}>🔗</span>
                                <div className={`${styles.modeStamp} ${styles.modeStampGreen}`}>DUO</div>
                            </div>
                            <div className={styles.modeCardBody}>
                                <h2 className={styles.modeTitle}>Duo Mode</h2>
                                <p className={styles.modeDesc}>
                                    Invite a friend from anywhere. Synchronized countdown, split-screen, merged memories.
                                </p>
                                <ul className={styles.modeFeatures}>
                                    {['🌍 Connect from anywhere', '⏱️ Synced countdown', '💞 Side-by-side frames', '🗺️ City labels'].map(f => (
                                        <li key={f}>{f}</li>
                                    ))}
                                </ul>
                                <Link href="/duo" className="btn-secondary" style={{ marginTop: '20px' }}>
                                    Go Live Together →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Feature strip ── */}
            <section className={styles.featureStrip}>
                <div className="page-wrapper">
                    <div className={styles.featureGrid}>
                        {[
                            ['🎞️', 'Real Film Filters', '19 handcrafted filters from golden hour to midnight'],
                            ['🖼️', '7 Layouts', 'Polaroid, strips, collage, postcard & more'],
                            ['✍️', 'Custom Captions', 'Handwritten fonts, dates, locations, stickers'],
                            ['🔗', 'Duo Mode', 'Sync capture with a friend anywhere in the world'],
                            ['📥', 'Instant Download', 'High-res PNG · no watermark · always free'],
                            ['🔒', 'Privacy First', 'All processing in your browser, photos never leave your device'],
                        ].map(([icon, title, desc]) => (
                            <div key={title} className={styles.featureCard}>
                                <span className={styles.featureIcon}>{icon}</span>
                                <h3 className={styles.featureTitle}>{title}</h3>
                                <p className={styles.featureDesc}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className={styles.cta}>
                <div className={styles.ctaInner}>
                    <h2 className={styles.ctaTitle}>Ready to make your first polaroid?</h2>
                    <p className={styles.ctaSub}>Click below — it takes 30 seconds. No account. Ever.</p>
                    <div className={styles.ctaBtns}>
                        <Link href="/solo" className="btn-primary" style={{ fontSize: '1.15rem', padding: '16px 40px' }}>📸 Solo Booth</Link>
                        <Link href="/duo" className="btn-secondary" style={{ fontSize: '1.15rem', padding: '15px 38px' }}>🔗 Duo Booth</Link>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className={styles.footer}>
                <Link href="/" className={styles.footerLogo}>Cozy Booth ✂️</Link>
                <div className={styles.footerLinks}>
                    <Link href="/solo">Solo</Link>
                    <Link href="/duo">Duo</Link>
                </div>
                <p className={styles.footerCopy}>Made with ☕ · All features free · No watermarks</p>
            </footer>
        </main>
    );
}
