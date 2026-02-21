'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import io from 'socket.io-client';
import styles from './page.module.css';

let socket;

export default function DuoLobbyPage() {
    const router = useRouter();
    const [joinCode, setJoinCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getSocket = () => {
        if (!socket) socket = io();
        return socket;
    };

    const handleCreate = async () => {
        setLoading(true);
        setError('');
        const s = getSocket();
        s.emit('create-room', ({ roomId, error: err }) => {
            if (err) { setError(err); setLoading(false); return; }
            router.push(`/duo/${roomId}?role=host`);
        });
    };

    const handleJoin = async () => {
        const code = joinCode.trim().toLowerCase();
        if (!code) { setError('Please enter a room code.'); return; }
        setLoading(true);
        setError('');
        const s = getSocket();
        s.emit('join-room', { roomId: code }, ({ roomId, error: err }) => {
            if (err) { setError(err); setLoading(false); return; }
            router.push(`/duo/${roomId}?role=guest`);
        });
    };

    return (
        <div className={styles.page}>
            <nav className={styles.topNav}>
                <Link href="/" className={styles.backBtn}>← Back</Link>
                <div className={styles.navTitle}><span>🔗</span> Duo Mode</div>
                <div />
            </nav>

            <div className={styles.content}>
                {/* ── Hero text ── */}
                <div className={styles.hero}>
                    <div className={styles.heroEmoji}>📸✨📸</div>
                    <h1 className={styles.heroTitle}>Go Live Together</h1>
                    <p className={styles.heroDesc}>
                        Create a room, share the link, and capture a synchronized memory — no matter the distance.
                    </p>
                    <div className={styles.stepsBadges}>
                        <div className={styles.step}><span>1</span> Create a room</div>
                        <div className={styles.stepArrow}>→</div>
                        <div className={styles.step}><span>2</span> Share the link</div>
                        <div className={styles.stepArrow}>→</div>
                        <div className={styles.step}><span>3</span> Capture together</div>
                    </div>
                </div>

                {/* ── Action Cards ── */}
                <div className={styles.cards}>

                    {/* Create Room */}
                    <div className={styles.card}>
                        <div className={styles.cardIcon}>🏠</div>
                        <h2 className={styles.cardTitle}>Host a Room</h2>
                        <p className={styles.cardDesc}>Create a private room and invite a friend with a link or code.</p>
                        <button
                            className={`btn-primary ${styles.cardBtn}`}
                            onClick={handleCreate}
                            disabled={loading}
                            id="create-room-btn"
                        >
                            {loading ? 'Creating…' : '+ Create Room'}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className={styles.divider}><span>or</span></div>

                    {/* Join Room */}
                    <div className={styles.card}>
                        <div className={styles.cardIcon}>🚪</div>
                        <h2 className={styles.cardTitle}>Join a Room</h2>
                        <p className={styles.cardDesc}>Got a room code from a friend? Enter it below to join.</p>
                        <input
                            className={styles.codeInput}
                            type="text"
                            placeholder="enter room code…"
                            value={joinCode}
                            onChange={e => setJoinCode(e.target.value.toLowerCase())}
                            onKeyDown={e => e.key === 'Enter' && handleJoin()}
                            id="room-code-input"
                            maxLength={8}
                        />
                        <button
                            className={`btn-secondary ${styles.cardBtn}`}
                            onClick={handleJoin}
                            disabled={loading || !joinCode.trim()}
                            id="join-room-btn"
                        >
                            {loading ? 'Joining…' : 'Join Room →'}
                        </button>
                    </div>
                </div>

                {error && <p className={styles.error}>⚠️ {error}</p>}

                {/* Features */}
                <div className={styles.features}>
                    {[
                        ['🌍', 'Connect from anywhere'],
                        ['⏱️', 'Synced countdown'],
                        ['💞', 'Side-by-side frames'],
                        ['📥', 'Shared download'],
                    ].map(([icon, label]) => (
                        <div key={label} className={styles.feature}>
                            <span>{icon}</span><span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
