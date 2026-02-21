'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
    useEffect(() => { console.error(error); }, [error]);
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', fontFamily: 'Nunito, sans-serif', background: '#faf6f0', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>⚠️</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: '#2c2116' }}>Something went wrong</h2>
            <p style={{ color: '#7a6a5a' }}>{error?.message || 'An unexpected error occurred.'}</p>
            <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-primary" onClick={reset}>Try Again</button>
                <Link href="/" className="btn-secondary">Go Home</Link>
            </div>
        </div>
    );
}
