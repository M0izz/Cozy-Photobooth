'use client';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', fontFamily: 'Nunito, sans-serif', background: 'var(--cream)', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem' }}>📸</div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#2c2116' }}>Page not found</h1>
            <p style={{ color: '#7a6a5a' }}>This memory doesn't exist yet.</p>
            <Link href="/" className="btn-primary">← Go Home</Link>
        </div>
    );
}
