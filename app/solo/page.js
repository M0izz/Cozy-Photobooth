'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { FILTERS, FILTER_CATEGORIES, applyFilter } from '@/lib/FilterEngine';
import {
    LAYOUTS, FRAME_THEMES, STICKER_PACKS,
    composeLayout,
} from '@/lib/LayoutComposer';
import styles from './page.module.css';

const CAPTURE_COUNTS = {
    'single-polaroid': 1,
    '2-strip': 2,
    '3-strip': 3,
    '4-strip': 4,
    'square-collage': 4,
    'postcard': 1,
    'borderless': 1,
};

export default function SoloPage() {
    const videoRef = useRef(null);
    const liveCanvasRef = useRef(null);
    const outputCanvasRef = useRef(null);
    const streamRef = useRef(null);
    const animRef = useRef(null);
    // Decoration overlay refs
    const doodleCanvasRef = useRef(null);
    const decorContainerRef = useRef(null);
    const isDrawingRef = useRef(false);
    const lastPosRef = useRef({ x: 0, y: 0 });
    const stickerIdRef = useRef(0);

    // Camera
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const [facingMode, setFacingMode] = useState('user');
    const [mirrored, setMirrored] = useState(true);

    // Filter
    const [activeFilter, setActiveFilter] = useState('none');
    const [filterIntensity, setFilterIntensity] = useState(0.85);
    const [filterCategory, setFilterCategory] = useState('all');

    // Layout
    const [activeLayout, setActiveLayout] = useState(null); // null until selected

    // Capture
    const [capturedFrames, setCapturedFrames] = useState([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const [countdown, setCountdown] = useState(null);
    // phase: 'selecting' | 'idle' | 'capturing' | 'reviewing'
    const [phase, setPhase] = useState('selecting');

    // Studio
    const [frameThemeId, setFrameThemeId] = useState('classic-white');
    const [customFrameColor, setCustomFrameColor] = useState('#ffffff');
    const [stickerPackId, setStickerPackId] = useState('none');
    const [caption, setCaption] = useState('');
    const [captionFont, setCaptionFont] = useState('Caveat, cursive');
    const [textOverlay, setTextOverlay] = useState('');
    const [textColor, setTextColor] = useState('#ffffff');
    const [textSize, setTextSize] = useState(28);
    const [textBold, setTextBold] = useState(false);
    const [showTimestamp, setShowTimestamp] = useState(false);
    const [locationText, setLocationText] = useState('');
    const [grainIntensity, setGrainIntensity] = useState(0.0);

    const [studioTab, setStudioTab] = useState('stickers');
    const [shareMsg, setShareMsg] = useState('');
    // Stickers — manual drag-to-place on photo
    const [placedStickers, setPlacedStickers] = useState([]); // [{id,emoji,x,y}]
    const [pendingSticker, setPendingSticker] = useState(null); // emoji waiting to be placed
    const [stickerCategory, setStickerCategory] = useState('cute');
    const [customEmojiInput, setCustomEmojiInput] = useState('');
    // Doodle tool
    const [isDoodleMode, setIsDoodleMode] = useState(false);
    const [doodleColor, setDoodleColor] = useState('#e74c3c');
    const [brushSize, setBrushSize] = useState(5);
    const [isEraser, setIsEraser] = useState(false);


    const needsFrames = activeLayout ? (CAPTURE_COUNTS[activeLayout] || 1) : 1;

    const effectiveFrameColor = (() => {
        const theme = FRAME_THEMES.find(t => t.id === frameThemeId);
        if (!theme) return customFrameColor;
        return theme.color ?? customFrameColor;
    })();

    // ── Start Camera ──────────────────────────────────────────────
    const startCamera = useCallback(async (facing) => {
        const mode = facing || facingMode;
        try {
            if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: mode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    // Don't let the browser software-resize the stream;
                    // use native sensor pixels for maximum sharpness
                    resizeMode: 'none',
                },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setCameraReady(true);
                setCameraError('');
            }
        } catch {
            setCameraError('Camera access denied. Allow access and refresh.');
        }
    }, [facingMode]);

    // Start camera when moving from selecting → idle
    useEffect(() => {
        if (phase === 'idle') {
            startCamera();
        }
        return () => {
            if (phase === 'selecting') {
                if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
                cancelAnimationFrame(animRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    // cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
            cancelAnimationFrame(animRef.current);
        };
    }, []);

    // ── Live render ───────────────────────────────────────────────
    useEffect(() => {
        if (phase === 'selecting' || phase === 'reviewing') return;
        const video = videoRef.current;
        const canvas = liveCanvasRef.current;
        if (!canvas || !video) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.imageSmoothingEnabled = false;
        let running = true;
        let sizedUp = false;
        const render = () => {
            if (!running) return;
            if (video.readyState >= 2 && video.videoWidth > 0) {
                // Size canvas to video native resolution once
                if (!sizedUp) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    sizedUp = true;
                }
                ctx.save();
                if (mirrored) { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                ctx.restore();
                if (activeFilter && activeFilter !== 'none') {
                    try {
                        const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        ctx.putImageData(applyFilter(d, activeFilter, filterIntensity), 0, 0);
                    } catch (_) { }
                }
            }
            animRef.current = requestAnimationFrame(render);
        };
        render();
        return () => { running = false; cancelAnimationFrame(animRef.current); };
    }, [activeFilter, filterIntensity, mirrored, cameraReady, phase]);

    // ── Re-compose on studio change ───────────────────────────────
    useEffect(() => {
        if (capturedFrames.length === 0 || !activeLayout) return;
        const out = outputCanvasRef.current;
        if (!out) return;
        const ts = showTimestamp
            ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : '';
        composeLayout(out, capturedFrames, activeLayout, {
            frameColor: effectiveFrameColor, caption, font: captionFont,
            timestamp: ts, location: locationText, grainIntensity,
            textOverlay, textColor, textSize, textBold,
        });
    }, [capturedFrames, activeLayout, effectiveFrameColor, caption, captionFont,
        showTimestamp, locationText, grainIntensity,
        textOverlay, textColor, textSize, textBold]);

    // ── Sync doodle canvas size to output canvas display ──────────
    useEffect(() => {
        if (phase !== 'reviewing') return;
        const syncSize = () => {
            const out = outputCanvasRef.current;
            const dc = doodleCanvasRef.current;
            if (!out || !dc) return;
            const r = out.getBoundingClientRect();
            dc.style.width = r.width + 'px';
            dc.style.height = r.height + 'px';
            if (dc.width !== Math.round(r.width)) {
                dc.width = Math.round(r.width);
                dc.height = Math.round(r.height);
            }
        };
        syncSize();
        const ro = new ResizeObserver(syncSize);
        if (outputCanvasRef.current) ro.observe(outputCanvasRef.current);
        return () => ro.disconnect();
    }, [phase]);

    // ── Doodle helpers ────────────────────────────────────────────
    const getDrawPos = (e) => {
        const dc = doodleCanvasRef.current;
        if (!dc) return { x: 0, y: 0 };
        const r = dc.getBoundingClientRect();
        const touch = e.touches?.[0] ?? e;
        return {
            x: (touch.clientX - r.left) * (dc.width / r.width),
            y: (touch.clientY - r.top) * (dc.height / r.height),
        };
    };

    const startDraw = useCallback((e) => {
        if (!isDoodleMode) return;
        e.preventDefault();
        isDrawingRef.current = true;
        const pos = getDrawPos(e);
        lastPosRef.current = pos;
        const dc = doodleCanvasRef.current;
        if (!dc) return;
        const ctx = dc.getContext('2d');
        ctx.save();
        if (isEraser) ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, (isEraser ? brushSize * 2 : brushSize) / 2, 0, Math.PI * 2);
        ctx.fillStyle = isEraser ? 'rgba(0,0,0,1)' : doodleColor;
        ctx.fill();
        ctx.restore();
    }, [isDoodleMode, isEraser, brushSize, doodleColor]);

    const draw = useCallback((e) => {
        if (!isDrawingRef.current || !isDoodleMode) return;
        e.preventDefault();
        const dc = doodleCanvasRef.current;
        if (!dc) return;
        const ctx = dc.getContext('2d');
        const pos = getDrawPos(e);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.lineWidth = isEraser ? brushSize * 2 : brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (isEraser) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
        } else {
            ctx.strokeStyle = doodleColor;
        }
        ctx.stroke();
        ctx.restore();
        lastPosRef.current = pos;
    }, [isDoodleMode, isEraser, brushSize, doodleColor]);

    const stopDraw = useCallback(() => { isDrawingRef.current = false; }, []);

    const clearDoodle = useCallback(() => {
        const dc = doodleCanvasRef.current;
        if (dc) dc.getContext('2d').clearRect(0, 0, dc.width, dc.height);
    }, []);

    // ── Sticker placement ─────────────────────────────────────────
    const handlePhotoClick = useCallback((e) => {
        if (!pendingSticker || isDoodleMode) return;
        const container = decorContainerRef.current;
        if (!container) return;
        const r = container.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        setPlacedStickers(prev => [...prev, { id: stickerIdRef.current++, emoji: pendingSticker, x, y }]);
        setPendingSticker(null);
    }, [pendingSticker, isDoodleMode]);

    // ── Snap frame ────────────────────────────────────────────────
    const snapFrame = useCallback(() => {
        const video = videoRef.current;
        if (!video || video.readyState < 2 || video.videoWidth === 0) return null;
        const snap = document.createElement('canvas');
        snap.width = video.videoWidth; snap.height = video.videoHeight;
        const ctx = snap.getContext('2d');
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
        if (mirrored) { ctx.translate(snap.width, 0); ctx.scale(-1, 1); }
        ctx.drawImage(video, 0, 0, snap.width, snap.height);
        if (mirrored) ctx.setTransform(1, 0, 0, 1, 0, 0);
        if (activeFilter && activeFilter !== 'none') {
            try { const d = ctx.getImageData(0, 0, snap.width, snap.height); ctx.putImageData(applyFilter(d, activeFilter, filterIntensity), 0, 0); } catch (_) { }
        }
        return snap.toDataURL('image/png');
    }, [mirrored, activeFilter, filterIntensity]);

    // ── Capture sequence ──────────────────────────────────────────
    const startCapture = useCallback(async () => {
        if (isCapturing) return;
        setIsCapturing(true);
        setCapturedFrames([]);
        setPhase('capturing');
        const frames = [];
        for (let i = 0; i < needsFrames; i++) {
            for (let c = 3; c >= 1; c--) { setCountdown(c); await sleep(850); }
            setCountdown('📸'); await sleep(250);
            const f = snapFrame();
            if (f) { frames.push(f); setCapturedFrames([...frames]); }
            setCountdown(null);
            if (i < needsFrames - 1) await sleep(700);
        }
        setIsCapturing(false);
        setPhase('reviewing');
    }, [isCapturing, needsFrames, snapFrame]);

    const handleRetake = () => {
        setCapturedFrames([]);
        setPhase('idle');
        setCaption('');
        setTextOverlay('');
        setPlacedStickers([]);
        setPendingSticker(null);
        setIsDoodleMode(false);
        clearDoodle();
    };

    const handleChangLayout = () => {
        // go back to layout selection
        setCapturedFrames([]);
        setActiveLayout(null);
        setPhase('selecting');
        setCameraReady(false);
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };

    const handleDownload = useCallback(() => {
        const canvas = outputCanvasRef.current;
        if (!canvas) return;
        // Bake onto a fresh canvas so original isn't mutated
        const baked = document.createElement('canvas');
        baked.width = canvas.width; baked.height = canvas.height;
        const ctx = baked.getContext('2d');
        ctx.drawImage(canvas, 0, 0);

        // Bake doodle overlay
        const dc = doodleCanvasRef.current;
        if (dc && dc.width > 0) {
            ctx.drawImage(dc, 0, 0, dc.width, dc.height, 0, 0, baked.width, baked.height);
        }

        // Bake drag-placed stickers
        const container = decorContainerRef.current;
        if (container && placedStickers.length > 0) {
            const r = container.getBoundingClientRect();
            const scaleX = baked.width / r.width;
            const scaleY = baked.height / r.height;
            const sz = Math.round(52 * ((scaleX + scaleY) / 2));
            ctx.font = `${sz}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            placedStickers.forEach(s => {
                ctx.fillText(s.emoji, s.x * baked.width, s.y * baked.height);
            });
        }

        const a = document.createElement('a');
        a.download = `cozy-booth-${Date.now()}.png`;
        a.href = baked.toDataURL('image/png', 1.0);
        a.click();
    }, [placedStickers]);

    const handleShare = useCallback(async () => {
        const canvas = outputCanvasRef.current;
        if (!canvas) return;
        canvas.toBlob(async (blob) => {
            if (!blob) return;
            if (navigator.share && navigator.canShare) {
                const file = new File([blob], 'cozy-booth.png', { type: 'image/png' });
                if (navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'My Cozy Booth' }); return; }
            }
            try { await navigator.clipboard.writeText(canvas.toDataURL('image/png')); setShareMsg('Copied!'); }
            catch { setShareMsg('Unsupported'); }
            setTimeout(() => setShareMsg(''), 2200);
        });
    }, []);

    const filteredFilters = filterCategory === 'all' ? FILTERS : FILTERS.filter(f => f.category === filterCategory);
    const isReviewing = phase === 'reviewing';

    return (
        <div className={styles.page}>
            {/* ── Nav ── */}
            <nav className={styles.topNav}>
                {phase === 'selecting'
                    ? <Link href="/" className={styles.backBtn}>← Home</Link>
                    : <button className={styles.backBtn} onClick={handleChangLayout}>← Change Layout</button>
                }
                <div className={styles.navTitle}>
                    {phase === 'selecting' ? '📸 Choose Layout' : isReviewing ? '🎨 Studio' : '📸 Solo Booth'}
                </div>
                <div />
            </nav>

            {/* ════════════════════════════════════════════════════
                PHASE 0: LAYOUT SELECTION SCREEN
                ════════════════════════════════════════════════════ */}
            {phase === 'selecting' && (
                <div className={styles.selectScreen}>
                    <div className={styles.selectHeading}>
                        <h1>How many shots do you want?</h1>
                        <p>Pick your layout and we'll open the camera</p>
                    </div>
                    <div className={styles.selectGrid}>
                        {LAYOUTS.map(layout => (
                            <button
                                key={layout.id}
                                className={styles.selectCard}
                                onClick={() => { setActiveLayout(layout.id); setPhase('idle'); }}
                            >
                                <span className={styles.selectIcon}>{layout.icon}</span>
                                <span className={styles.selectName}>{layout.name}</span>
                                <span className={styles.selectCount}>
                                    {layout.frames} shot{layout.frames > 1 ? 's' : ''}
                                </span>
                                <div className={styles.selectArrow}>Start →</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════════════════
                PHASE 1: CAPTURE — slot sidebar + big camera + filter panel
                ════════════════════════════════════════════════════ */}
            {(phase === 'idle' || phase === 'capturing') && (
                <div className={styles.captureLayout}>
                    {/* ── Left slot sidebar ── */}
                    <aside className={styles.slotSidebar}>
                        <div className={styles.quickGuide}>
                            📋 <strong>Guide</strong>
                            <p>Tap the red button to take a photo</p>
                            <p>Fill all {needsFrames} slot{needsFrames > 1 ? 's' : ''}</p>
                        </div>
                        {Array.from({ length: needsFrames }).map((_, i) => (
                            <div key={i} className={`${styles.sideSlot}
                                ${capturedFrames[i] ? styles.sideSlotFilled : ''}
                                ${!capturedFrames[i] && i === capturedFrames.length && isCapturing ? styles.sideSlotActive : ''}`}>
                                {capturedFrames[i]
                                    ? <img src={capturedFrames[i]} alt="" className={styles.sideSlotImg} />
                                    : <span className={styles.sideSlotNum}>{i + 1}</span>}
                            </div>
                        ))}
                        <div className={styles.sideCount}>{capturedFrames.length}/{needsFrames}</div>
                    </aside>

                    {/* ── Center: Big camera ── */}
                    <div className={styles.cameraMain}>
                        <video ref={videoRef} style={{ display: 'none' }} playsInline muted />
                        {!cameraReady && !cameraError && (
                            <div className={styles.camOverlay}>
                                <div className={styles.loadingSpinner} />
                                <p>Starting camera…</p>
                            </div>
                        )}
                        {cameraError && (
                            <div className={styles.camOverlay}>
                                <span style={{ fontSize: '3rem' }}>📷</span>
                                <p>{cameraError}</p>
                                <button className="btn-primary" onClick={() => startCamera()}>Retry</button>
                            </div>
                        )}
                        <canvas ref={liveCanvasRef} className={styles.liveCanvas} />
                        {countdown !== null && (
                            <div className={styles.countdownOverlay}>
                                <span className={styles.countdownNum}>{countdown}</span>
                            </div>
                        )}
                        {/* Bottom capture controls */}
                        <div className={styles.captureControls}>
                            <button className={`${styles.ctrlPill} ${styles.ctrlBlue}`}
                                onClick={() => setMirrored(m => !m)} title="Mirror">↔️</button>
                            <button
                                className={`${styles.captureBig} ${isCapturing ? styles.capturingBig : ''}`}
                                onClick={startCapture}
                                disabled={isCapturing || !cameraReady}
                                id="capture-btn"
                            >
                                <div className={styles.captureBigInner} />
                            </button>
                            <button className={`${styles.ctrlPill} ${styles.ctrlYellow}`}
                                onClick={async () => {
                                    const next = facingMode === 'user' ? 'environment' : 'user';
                                    setFacingMode(next); await startCamera(next);
                                }} title="Flip">🔄</button>
                        </div>
                    </div>

                    {/* ── Right: Filter panel ── */}
                    <aside className={styles.filterPanel}>
                        <div className={styles.filterPanelTitle}>🎞️ Filters</div>
                        {/* Intensity */}
                        <div className={styles.intensityRow}>
                            <span>Strength</span>
                            <input type="range" min="0" max="100"
                                value={Math.round(filterIntensity * 100)}
                                onChange={e => setFilterIntensity(e.target.value / 100)} />
                            <span>{Math.round(filterIntensity * 100)}%</span>
                        </div>
                        {/* Category tabs */}
                        <div className={styles.catRow}>
                            {FILTER_CATEGORIES.map(cat => (
                                <button key={cat.id}
                                    className={`${styles.catChip} ${filterCategory === cat.id ? styles.catChipOn : ''}`}
                                    onClick={() => setFilterCategory(cat.id)}>{cat.label}</button>
                            ))}
                        </div>
                        {/* Filter list */}
                        <div className={styles.filterList}>
                            <button
                                className={`${styles.filterItem} ${activeFilter === 'none' ? styles.filterItemOn : ''}`}
                                onClick={() => setActiveFilter('none')}>
                                <span>✦</span>
                                <span className={styles.filterItemName}>None</span>
                            </button>
                            {filteredFilters.map(f => (
                                <button key={f.id}
                                    className={`${styles.filterItem} ${activeFilter === f.id ? styles.filterItemOn : ''}`}
                                    onClick={() => setActiveFilter(f.id)}>
                                    <span>{f.emoji}</span>
                                    <span className={styles.filterItemName}>{f.name}</span>
                                </button>
                            ))}
                        </div>
                    </aside>
                </div>
            )}

            {/* ════════════════════════════════════════════════════
                PHASE 2: STUDIO
                ════════════════════════════════════════════════════ */}
            {isReviewing && (
                <div className={styles.studioLayout}>
                    {/* Photo preview + doodle/sticker overlay */}
                    <div className={styles.photoArea}>
                        <div className={styles.photoCard}>
                            {/* Relative container for overlays */}
                            <div
                                ref={decorContainerRef}
                                style={{
                                    position: 'relative', display: 'inline-block',
                                    cursor: isDoodleMode ? (isEraser ? 'cell' : 'crosshair')
                                        : pendingSticker ? `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text y='28' font-size='28'>${pendingSticker}</text></svg>") 0 28, crosshair`
                                            : 'default'
                                }}
                                onClick={handlePhotoClick}
                            >
                                <canvas ref={outputCanvasRef} className={styles.outputCanvas} />

                                {/* Doodle canvas overlay */}
                                <canvas ref={doodleCanvasRef}
                                    style={{
                                        position: 'absolute', inset: 0, borderRadius: 2,
                                        pointerEvents: isDoodleMode ? 'auto' : 'none',
                                        touchAction: 'none',
                                    }}
                                    onPointerDown={startDraw}
                                    onPointerMove={draw}
                                    onPointerUp={stopDraw}
                                    onPointerLeave={stopDraw}
                                />

                                {/* Placed sticker overlays */}
                                {placedStickers.map(s => (
                                    <div key={s.id}
                                        style={{
                                            position: 'absolute',
                                            left: `${s.x * 100}%`, top: `${s.y * 100}%`,
                                            transform: 'translate(-50%,-50%)',
                                            fontSize: '2.4rem', lineHeight: 1,
                                            cursor: 'grab', userSelect: 'none',
                                            filter: 'drop-shadow(1px 2px 4px rgba(0,0,0,0.35))',
                                            zIndex: 10,
                                        }}
                                        title="Drag to move · Double-click to remove"
                                        onDoubleClick={(e) => { e.stopPropagation(); setPlacedStickers(prev => prev.filter(ps => ps.id !== s.id)); }}
                                        onPointerDown={(e) => {
                                            e.stopPropagation();
                                            e.currentTarget.setPointerCapture(e.pointerId);
                                            const sid = s.id;
                                            const container = decorContainerRef.current;
                                            if (!container) return;
                                            const onMove = (me) => {
                                                const r = container.getBoundingClientRect();
                                                const nx = Math.max(0, Math.min(1, (me.clientX - r.left) / r.width));
                                                const ny = Math.max(0, Math.min(1, (me.clientY - r.top) / r.height));
                                                setPlacedStickers(prev => prev.map(ps => ps.id === sid ? { ...ps, x: nx, y: ny } : ps));
                                            };
                                            const onUp = () => {
                                                document.removeEventListener('pointermove', onMove);
                                                document.removeEventListener('pointerup', onUp);
                                            };
                                            document.addEventListener('pointermove', onMove);
                                            document.addEventListener('pointerup', onUp);
                                        }}
                                    >
                                        {s.emoji}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Status hint */}
                        {(pendingSticker || isDoodleMode) && (
                            <div style={{ fontSize: '0.78rem', color: '#888', fontFamily: 'var(--font-hand)', marginTop: -8 }}>
                                {pendingSticker ? `📍 Click on the photo to place ${pendingSticker}` : '✏️ Draw on the photo · Pointer down to paint'}
                            </div>
                        )}

                        <div className={styles.photoActions}>
                            <button className={styles.retakeBtn} onClick={handleRetake}>🔄 Retake</button>
                            <button className="btn-primary" onClick={handleDownload} id="download-btn">📥 Download</button>
                            <button className={styles.shareBtn} onClick={handleShare} id="share-btn">
                                🔗 Share {shareMsg && <span className={styles.shareMsg}>{shareMsg}</span>}
                            </button>
                        </div>
                    </div>

                    {/* Studio panel */}
                    <div className={styles.studioPanel}>
                        <div className={styles.studioHeader}>
                            <span className={styles.studioTitle}>Studio 🎨</span>
                            <span className={styles.studioHint}>Tap tabs to add stickers, text, filters &amp; frames</span>
                        </div>
                        <div className={styles.studioTabs}>
                            {[['stickers', '✨ Stickers'], ['text', '✍️ Text'], ['filters', '🎞️ Filters'], ['frames', '🖼️ Frames']].map(([id, lbl]) => (
                                <button key={id}
                                    className={`${styles.studioTab} ${studioTab === id ? styles.studioTabActive : ''}`}
                                    onClick={() => setStudioTab(id)}>{lbl}</button>
                            ))}
                        </div>

                        <div className={styles.studioContent}>
                            {studioTab === 'stickers' && (() => {
                                const browsingPack = STICKER_PACKS.find(p => p.id === stickerCategory);
                                const gridEmojis = browsingPack ? browsingPack.stickers : [];
                                return (
                                    <>
                                        {/* Placed sticker chips */}
                                        {placedStickers.length > 0 && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                                                <span style={{ fontSize: '0.68rem', color: '#888', alignSelf: 'center' }}>On photo:</span>
                                                {placedStickers.map(s => (
                                                    <span key={s.id} style={{ fontSize: '1.2rem', cursor: 'pointer' }}
                                                        title="Double-click on photo to remove"
                                                    >{s.emoji}</span>
                                                ))}
                                                <button style={{ fontSize: '0.62rem', color: '#aaa', background: 'none', border: '1px dashed #ddd', borderRadius: 6, padding: '1px 7px', cursor: 'pointer' }}
                                                    onClick={() => setPlacedStickers([])}>
                                                    Clear
                                                </button>
                                            </div>
                                        )}

                                        {/* Pending sticker hint */}
                                        {pendingSticker && (
                                            <div style={{ background: '#fff5d6', border: '1.5px solid #f5c84b', borderRadius: 8, padding: '6px 10px', fontSize: '0.78rem', color: '#7a5900', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                                <span style={{ fontSize: '1.5rem' }}>{pendingSticker}</span>
                                                <span>Click anywhere on the photo to place it</span>
                                                <button onClick={() => setPendingSticker(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#7a5900', fontSize: '1rem' }}>✕</button>
                                            </div>
                                        )}

                                        {/* Custom emoji input */}
                                        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                                            <input className={styles.textInput} type="text"
                                                placeholder="Type / paste any emoji"
                                                value={customEmojiInput}
                                                onChange={e => setCustomEmojiInput(e.target.value)}
                                                style={{ flex: 1, fontSize: '1.1rem' }}
                                                maxLength={8} />
                                            <button className={styles.addBtn}
                                                disabled={!customEmojiInput.trim()}
                                                onClick={() => {
                                                    if (customEmojiInput.trim()) setPendingSticker(customEmojiInput.trim());
                                                    setCustomEmojiInput('');
                                                }}>Pick</button>
                                        </div>

                                        {/* Category tabs */}
                                        <div className={styles.catRow} style={{ flexWrap: 'wrap' }}>
                                            {STICKER_PACKS.filter(p => p.id !== 'none').map(p => (
                                                <button key={p.id}
                                                    className={`${styles.catChip} ${stickerCategory === p.id ? styles.catChipOn : ''}`}
                                                    onClick={() => setStickerCategory(p.id)}>{p.icon}</button>
                                            ))}
                                        </div>

                                        {/* Emoji grid — click to select, then click photo to place */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginTop: 8 }}>
                                            {gridEmojis.map((emoji, i) => {
                                                const isPending = pendingSticker === emoji;
                                                return (
                                                    <button key={i}
                                                        style={{
                                                            fontSize: '1.7rem', background: isPending ? '#fff5d6' : 'white',
                                                            border: isPending ? '2px solid #f5a623' : '1.5px dashed #ddd',
                                                            borderRadius: 10, padding: '8px 2px', cursor: 'pointer',
                                                            transition: 'all 0.12s',
                                                            transform: isPending ? 'scale(1.15)' : 'scale(1)',
                                                            boxShadow: isPending ? '0 2px 8px rgba(245,166,35,0.4)' : 'none',
                                                        }}
                                                        title={isPending ? 'Selected — click photo to place' : 'Click to pick'}
                                                        onClick={() => setPendingSticker(isPending ? null : emoji)}>
                                                        {emoji}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Doodle section */}
                                        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed #eee' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)' }}>✏️ Doodle</span>
                                                <button
                                                    style={{
                                                        padding: '5px 14px', borderRadius: 20,
                                                        background: isDoodleMode ? '#1a1a1a' : 'white',
                                                        color: isDoodleMode ? 'white' : 'var(--ink)',
                                                        border: '2px solid var(--ink)',
                                                        fontFamily: 'var(--font-hand)', fontSize: '0.82rem',
                                                        cursor: 'pointer', transition: 'all 0.15s',
                                                    }}
                                                    onClick={() => { setIsDoodleMode(v => !v); setIsEraser(false); }}>
                                                    {isDoodleMode ? '✅ Drawing' : 'Start Drawing'}
                                                </button>
                                            </div>

                                            {isDoodleMode && (
                                                <>
                                                    {/* Brush / Eraser toggle */}
                                                    <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                                                        <button onClick={() => setIsEraser(false)}
                                                            style={{ flex: 1, padding: '6px', borderRadius: 8, background: !isEraser ? 'var(--ink)' : 'white', color: !isEraser ? 'white' : 'var(--ink)', border: '1.5px dashed var(--ink)', cursor: 'pointer', fontSize: '0.8rem' }}>
                                                            🖊️ Pen
                                                        </button>
                                                        <button onClick={() => setIsEraser(true)}
                                                            style={{ flex: 1, padding: '6px', borderRadius: 8, background: isEraser ? 'var(--ink)' : 'white', color: isEraser ? 'white' : 'var(--ink)', border: '1.5px dashed var(--ink)', cursor: 'pointer', fontSize: '0.8rem' }}>
                                                            🧹 Erase
                                                        </button>
                                                        <button onClick={clearDoodle}
                                                            style={{ flex: 1, padding: '6px', borderRadius: 8, background: '#fff5f5', color: '#c00', border: '1.5px dashed #f88', cursor: 'pointer', fontSize: '0.8rem' }}>
                                                            🗑️ Clear
                                                        </button>
                                                    </div>

                                                    {/* Color swatches */}
                                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                                                        {['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#1a1a1a', '#ffffff'].map(c => (
                                                            <button key={c} onClick={() => { setDoodleColor(c); setIsEraser(false); }}
                                                                style={{
                                                                    width: 26, height: 26, borderRadius: '50%',
                                                                    background: c, border: doodleColor === c && !isEraser ? '3px solid var(--ink)' : '2px solid #ddd',
                                                                    cursor: 'pointer', transition: 'transform 0.1s',
                                                                    transform: doodleColor === c && !isEraser ? 'scale(1.2)' : 'scale(1)',
                                                                    boxShadow: c === '#ffffff' ? 'inset 0 0 0 1px #ccc' : 'none',
                                                                }} />
                                                        ))}
                                                        <input type="color" value={doodleColor} onChange={e => { setDoodleColor(e.target.value); setIsEraser(false); }}
                                                            style={{ width: 26, height: 26, border: 'none', cursor: 'pointer', borderRadius: '50%', padding: 0 }} title="Custom color" />
                                                    </div>

                                                    {/* Brush size */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <span style={{ fontSize: '0.72rem', color: '#888', fontFamily: 'var(--font-hand)' }}>Size · {brushSize}px</span>
                                                        <input type="range" min="2" max="30" value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} style={{ flex: 1 }} />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </>
                                );
                            })()}
                            {/* ── Text ── */}
                            {studioTab === 'text' && (
                                <>
                                    <div className={styles.textRow}>
                                        <input className={styles.textInput} type="text" placeholder="Type caption…"
                                            value={caption} onChange={e => setCaption(e.target.value)} maxLength={60} />
                                        <button className={styles.addBtn} onClick={() => { }}>Add</button>
                                    </div>
                                    <div className={styles.captionPresets}>
                                        {['HBD 🎂', 'Love 💕', 'Summer ☀️', 'Besties 👯'].map(p => (
                                            <button key={p} className={styles.captionPreset} onClick={() => setCaption(p)}>{p}</button>
                                        ))}
                                    </div>
                                    <p className={styles.panelLabel}>Font Style:</p>
                                    <div className={styles.fontStyleGrid}>
                                        {[
                                            { label: 'Handwriting', value: 'Caveat, cursive', bg: '#FFF200' },
                                            { label: 'MARKER', value: 'Amatic SC, cursive', bg: '#f0f0f0' },
                                            { label: 'Elegant', value: 'Playfair Display, serif', bg: '#f5e6c8' },
                                            { label: 'Mono', value: 'Courier New, monospace', bg: '#e0f0ff' },
                                        ].map(f => (
                                            <button key={f.label}
                                                className={`${styles.fontStyleCard} ${captionFont === f.value ? styles.fontStyleActive : ''}`}
                                                style={{ background: f.bg, fontFamily: f.value }}
                                                onClick={() => setCaptionFont(f.value)}>{f.label}</button>
                                        ))}
                                    </div>
                                    <p className={styles.panelLabel}>Text Overlay:</p>
                                    <div className={styles.textRow}>
                                        <input className={styles.textInput} type="text" placeholder="overlay text…"
                                            value={textOverlay} onChange={e => setTextOverlay(e.target.value)} />
                                        <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className={styles.colorPicker} />
                                    </div>
                                    <div className={styles.textColorSwatches}>
                                        {['#ffffff', '#1a1a1a', '#FF5252', '#FFD600', '#4CAF50', '#2196F3'].map(c => (
                                            <button key={c} className={`${styles.swatchDot} ${textColor === c ? styles.swatchActive : ''}`}
                                                style={{ background: c, border: c === '#ffffff' ? '2px solid #ccc' : 'none' }}
                                                onClick={() => setTextColor(c)} />
                                        ))}
                                    </div>
                                    <label className={styles.panelLabel}>Size · {textSize}</label>
                                    <input type="range" min="10" max="60" value={textSize} onChange={e => setTextSize(Number(e.target.value))} />
                                </>
                            )}
                            {/* ── Filters (studio) ── */}
                            {studioTab === 'filters' && (
                                <>
                                    <div className={styles.catRow}>
                                        {FILTER_CATEGORIES.map(cat => (
                                            <button key={cat.id}
                                                className={`${styles.catChip} ${filterCategory === cat.id ? styles.catChipOn : ''}`}
                                                onClick={() => setFilterCategory(cat.id)}>{cat.label}</button>
                                        ))}
                                    </div>
                                    <div className={styles.filterGrid}>
                                        {filteredFilters.map(f => (
                                            <button key={f.id}
                                                className={`${styles.filterCard} ${activeFilter === f.id ? styles.filterCardActive : ''}`}
                                                onClick={() => setActiveFilter(f.id)}>
                                                <div className={styles.filterThumb}>{f.emoji}</div>
                                                <span className={styles.filterName}>{f.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                            {/* ── Frames ── */}
                            {studioTab === 'frames' && (
                                <>
                                    <p className={styles.panelLabel}>Frame Theme</p>
                                    <div className={styles.frameGrid}>
                                        {FRAME_THEMES.map(theme => (
                                            <button key={theme.id}
                                                className={`${styles.frameCard} ${frameThemeId === theme.id ? styles.frameCardActive : ''}`}
                                                style={{ background: theme.color ?? '#f3f3f1' }}
                                                onClick={() => setFrameThemeId(theme.id)}>
                                                {theme.isNew && <span className={styles.newBadge}>New</span>}
                                                <span className={styles.frameCardName} style={{ color: theme.textColor }}>{theme.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {frameThemeId === 'custom' && (
                                        <div className={styles.colorPickerRow} style={{ marginTop: 10 }}>
                                            <input type="color" value={customFrameColor} onChange={e => setCustomFrameColor(e.target.value)} className={styles.colorPicker} />
                                            <span className={styles.colorHex}>{customFrameColor}</span>
                                        </div>
                                    )}
                                    <div style={{ marginTop: 12 }}>
                                        <p className={styles.panelLabel}>📅 Timestamp</p>
                                        <button className={`${styles.toggle} ${showTimestamp ? styles.toggleOn : ''}`}
                                            onClick={() => setShowTimestamp(v => !v)}>{showTimestamp ? '✅ On' : 'Off'}</button>
                                    </div>
                                    <div style={{ marginTop: 10 }}>
                                        <p className={styles.panelLabel}>📍 Location</p>
                                        <input className={styles.customInput} type="text" placeholder="e.g. Tokyo, Japan"
                                            value={locationText} onChange={e => setLocationText(e.target.value)} />
                                    </div>
                                    <div style={{ marginTop: 10 }}>
                                        <p className={styles.panelLabel}>🌾 Grain · {Math.round(grainIntensity * 100)}%</p>
                                        <input type="range" min="0" max="100"
                                            value={Math.round(grainIntensity * 100)}
                                            onChange={e => setGrainIntensity(e.target.value / 100)} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
