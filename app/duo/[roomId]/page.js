'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import io from 'socket.io-client';
import { FILTERS, applyFilter } from '@/lib/FilterEngine';
import { DUO_LAYOUTS, FRAME_COLORS, FONTS, composeLayout } from '@/lib/LayoutComposer';
import styles from './page.module.css';

let socket;

export default function DuoRoomPage() {
    const { roomId } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const role = searchParams.get('role') || 'guest'; // 'host' | 'guest'

    const videoRef = useRef(null);
    const myCanvasRef = useRef(null);
    const partnerCanvasRef = useRef(null);
    const outputCanvasRef = useRef(null);
    const streamRef = useRef(null);
    const animRef = useRef(null);
    const partnerImgRef = useRef(null);

    const [cameraReady, setCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const [partnerConnected, setPartnerConnected] = useState(false);
    const [partnerLeft, setPartnerLeft] = useState(false);
    const [copied, setCopied] = useState(false);

    const [activeFilter, setActiveFilter] = useState('warm-vintage');
    const [filterIntensity, setFilterIntensity] = useState(0.85);

    const [activeLayout, setActiveLayout] = useState('side-by-side');
    const [frameColor, setFrameColor] = useState('#fdf9f3');
    const [caption, setCaption] = useState('');
    const [captionFont, setCaptionFont] = useState('Caveat, cursive');

    const [countdown, setCountdown] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [myCapture, setMyCapture] = useState(null);
    const [partnerCapture, setPartnerCapture] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [partnerFrame, setPartnerFrame] = useState(null); // live preview frame from partner

    const getSocket = useCallback(() => {
        if (!socket || !socket.connected) {
            socket = io();
        }
        return socket;
    }, []);

    // ── Camera ────────────────────────────────────────────────────
    useEffect(() => {
        const startCam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
                    audio: false,
                });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                    setCameraReady(true);
                }
            } catch (err) {
                setCameraError('Camera access denied. Please allow camera and refresh.');
            }
        };
        startCam();
        return () => {
            if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
            cancelAnimationFrame(animRef.current);
        };
    }, []);

    // ── Live filter loop (my camera) ──────────────────────────────
    useEffect(() => {
        const video = videoRef.current;
        const canvas = myCanvasRef.current;
        if (!canvas || !video) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        let running = true;
        let frameCount = 0;

        const render = () => {
            if (!running) return;
            if (video.readyState === 4) {
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 480;
                ctx.save();
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                ctx.restore();
                if (activeFilter) {
                    try {
                        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        ctx.putImageData(applyFilter(imgData, activeFilter, filterIntensity), 0, 0);
                    } catch (e) { }
                }
                // Send frame to partner every 6th frame (~10fps)
                frameCount++;
                if (frameCount % 6 === 0 && partnerConnected) {
                    const thumb = canvas.toDataURL('image/jpeg', 0.3);
                    getSocket().emit('send-frame', { roomId, frameData: thumb });
                }
            }
            animRef.current = requestAnimationFrame(render);
        };
        render();
        return () => { running = false; cancelAnimationFrame(animRef.current); };
    }, [activeFilter, filterIntensity, cameraReady, partnerConnected, roomId, getSocket]);

    // ── Draw partner frame ────────────────────────────────────────
    useEffect(() => {
        if (!partnerFrame || !partnerCanvasRef.current) return;
        const canvas = partnerCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = partnerFrame;
    }, [partnerFrame]);

    // ── Socket.io events ──────────────────────────────────────────
    useEffect(() => {
        const s = getSocket();

        if (role === 'guest') {
            s.emit('join-room', { roomId }, ({ error: err }) => {
                if (err) { alert('Room not found or full. ' + err); router.push('/duo'); }
            });
        }

        s.on('room-update', ({ guestId }) => {
            if (guestId) setPartnerConnected(true);
        });

        s.on('receive-frame', ({ frameData }) => {
            setPartnerFrame(frameData);
            setPartnerConnected(true);
        });

        s.on('countdown-start', () => runCountdown(s));

        s.on('receive-capture', ({ imageData }) => {
            setPartnerCapture(imageData);
        });

        s.on('partner-left', () => {
            setPartnerConnected(false);
            setPartnerLeft(true);
        });

        return () => {
            s.off('room-update');
            s.off('receive-frame');
            s.off('countdown-start');
            s.off('receive-capture');
            s.off('partner-left');
        };
    }, [roomId, role, router, getSocket]);

    // ── Countdown + Capture ───────────────────────────────────────
    const runCountdown = useCallback(async (s) => {
        setIsCapturing(true);
        for (let c = 3; c >= 1; c--) {
            setCountdown(c);
            await sleep(900);
        }
        setCountdown('📸');
        await sleep(300);

        // Capture my frame
        const canvas = myCanvasRef.current;
        const myImg = canvas ? canvas.toDataURL('image/png') : null;
        setMyCapture(myImg);
        if (s && myImg) s.emit('share-capture', { roomId, imageData: myImg });

        setCountdown(null);
        setIsCapturing(false);
    }, [roomId]);

    // When host clicks capture
    const handleHostCapture = useCallback(() => {
        if (isCapturing) return;
        const s = getSocket();
        s.emit('start-countdown', { roomId });
    }, [isCapturing, roomId, getSocket]);

    // ── Compose result when both captures are ready ───────────────
    useEffect(() => {
        if (!myCapture) return;
        const otherCapture = partnerCapture || myCapture; // fallback to own frame if solo
        const out = outputCanvasRef.current;
        if (!out) return;

        const frames = role === 'host'
            ? [myCapture, otherCapture]
            : [otherCapture, myCapture];

        composeLayout(out, frames, activeLayout, { frameColor, caption, font: captionFont })
            .then(() => setShowResult(true));
    }, [myCapture, partnerCapture, activeLayout, frameColor, caption, captionFont, role]);

    // ── Copy room link ────────────────────────────────────────────
    const handleCopy = () => {
        const url = `${window.location.origin}/duo/${roomId}?role=guest`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // ── Download ──────────────────────────────────────────────────
    const handleDownload = () => {
        const canvas = outputCanvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `cozy-duo-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    };

    const handleRetake = () => {
        setShowResult(false);
        setMyCapture(null);
        setPartnerCapture(null);
    };

    return (
        <div className={styles.page}>
            {/* ── Navbar ── */}
            <nav className={styles.topNav}>
                <Link href="/duo" className={styles.backBtn}>← Back</Link>
                <div className={styles.navTitle}>
                    <span>🔗</span>
                    <span>Room <code className={styles.roomCode}>{roomId}</code></span>
                </div>
                <button className={styles.copyBtn} onClick={handleCopy} id="copy-link-btn">
                    {copied ? '✅ Copied!' : '🔗 Copy Link'}
                </button>
            </nav>

            {/* ── Status Bar ── */}
            <div className={`${styles.statusBar} ${partnerConnected ? styles.statusConnected : styles.statusWaiting}`}>
                {partnerLeft
                    ? '⚠️ Your partner left the room.'
                    : partnerConnected
                        ? '✅ Both connected! Click Capture when ready.'
                        : '⏳ Waiting for your partner to join… Share the link above!'}
            </div>

            <div className={styles.boothLayout}>
                {/* ── Previews ── */}
                <div className={styles.previewsSection}>
                    <div className={styles.previews}>
                        {/* My camera */}
                        <div className={styles.previewBox}>
                            <div className={styles.previewLabel}>
                                {role === 'host' ? '👑 You (Host)' : '🙋 You (Guest)'}
                            </div>
                            <video ref={videoRef} style={{ display: 'none' }} playsInline muted />
                            <canvas ref={myCanvasRef} className={styles.previewCanvas} />
                            {cameraError && <div className={styles.camErr}>{cameraError}</div>}
                        </div>

                        {/* Partner camera */}
                        <div className={styles.previewBox}>
                            <div className={styles.previewLabel}>
                                {role === 'host' ? '🙋 Partner (Guest)' : '👑 Partner (Host)'}
                            </div>
                            {partnerConnected ? (
                                <canvas ref={partnerCanvasRef} className={styles.previewCanvas} />
                            ) : (
                                <div className={styles.waitingBox}>
                                    <div className={styles.loadingDots}><span /><span /><span /></div>
                                    <p>Waiting for partner…</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Countdown overlay spanning both */}
                    {countdown !== null && (
                        <div className={styles.countdownOverlay}>
                            <span className={styles.countdownNum}>{countdown}</span>
                        </div>
                    )}

                    {/* Controls */}
                    <div className={styles.controls}>
                        {/* Filter picker (compact) */}
                        <div className={styles.filterRow}>
                            {FILTERS.slice(0, 8).map(f => (
                                <button key={f.id} className={`${styles.filterPill} ${activeFilter === f.id ? styles.filterPillActive : ''}`}
                                    onClick={() => setActiveFilter(f.id)}>
                                    {f.emoji} {f.name}
                                </button>
                            ))}
                        </div>

                        {/* Capture */}
                        {role === 'host' ? (
                            <button className={`${styles.captureBtn} ${isCapturing ? styles.capturingBtn : ''}`}
                                onClick={handleHostCapture} disabled={isCapturing || !cameraReady} id="duo-capture-btn">
                                {isCapturing ? '⏳ Capturing…' : '📸 Capture Together'}
                            </button>
                        ) : (
                            <div className={styles.guestHint}>
                                <span>⏳</span> Waiting for host to start the countdown…
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right: Customization ── */}
                <div className={styles.sidePanel}>
                    <h3 className={styles.sidePanelTitle}>✨ Customize</h3>

                    <div className={styles.customGroup}>
                        <label className={styles.customLabel}>🖼️ Layout</label>
                        <div className={styles.layoutList}>
                            {DUO_LAYOUTS.map(l => (
                                <button key={l.id} className={`${styles.layoutBtn} ${activeLayout === l.id ? styles.layoutBtnActive : ''}`}
                                    onClick={() => setActiveLayout(l.id)}>
                                    {l.icon} {l.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.customGroup}>
                        <label className={styles.customLabel}>🎨 Frame Color</label>
                        <div className={styles.colorRow}>
                            {FRAME_COLORS.map(c => (
                                <button key={c.id} title={c.label}
                                    className={`${styles.colorDot} ${frameColor === c.value ? styles.colorDotActive : ''}`}
                                    style={{ background: c.value, border: c.id === 'white' ? '1px solid #ddd' : 'none' }}
                                    onClick={() => setFrameColor(c.value)} />
                            ))}
                        </div>
                    </div>

                    <div className={styles.customGroup}>
                        <label className={styles.customLabel}>✍️ Shared Caption</label>
                        <input className={styles.customInput} type="text" placeholder="add a shared memory…"
                            value={caption} onChange={e => setCaption(e.target.value)} maxLength={60} />
                    </div>

                    <div className={styles.customGroup}>
                        <label className={styles.customLabel}>🖋️ Font</label>
                        <div className={styles.fontRow}>
                            {FONTS.slice(0, 3).map(f => (
                                <button key={f.id} className={`${styles.fontBtn} ${captionFont === f.value ? styles.fontBtnActive : ''}`}
                                    style={{ fontFamily: f.value }} onClick={() => setCaptionFont(f.value)}>
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {showResult && (
                        <div className={styles.resultSection}>
                            <h4 className={styles.resultTitle}>Your Memory ✨</h4>
                            <canvas ref={outputCanvasRef} className={styles.resultCanvas} />
                            <div className={styles.resultBtns}>
                                <button className="btn-primary" onClick={handleDownload} id="duo-download-btn">📥 Download</button>
                                <button className="btn-secondary" onClick={handleRetake}>🔄 Retake</button>
                            </div>
                        </div>
                    )}
                    {!showResult && <canvas ref={outputCanvasRef} style={{ display: 'none' }} />}
                </div>
            </div>
        </div>
    );
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
