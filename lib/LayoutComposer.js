// ════════════════════════════════════════════════════════════════
//  LayoutComposer.js  –  Frame rendering + Studio features
// ════════════════════════════════════════════════════════════════

// ─── Layouts ────────────────────────────────────────────────────
export const LAYOUTS = [
    { id: 'single-polaroid', name: 'Single Polaroid', icon: '🖼️', frames: 1 },
    { id: '2-strip', name: '2-Photo Strip', icon: '📄', frames: 2 },
    { id: '3-strip', name: '3-Photo Strip', icon: '📋', frames: 3 },
    { id: '4-strip', name: '4-Photo Classic', icon: '🎞️', frames: 4 },
    { id: 'square-collage', name: 'Square Collage', icon: '⊞', frames: 4 },
    { id: 'postcard', name: 'Postcard', icon: '💌', frames: 1 },
    { id: 'borderless', name: 'Minimalist', icon: '◻️', frames: 1 },
];

export const DUO_LAYOUTS = [
    { id: 'side-by-side', name: 'Side by Side', icon: '◫' },
    { id: 'vertical-post', name: 'Vertical Post', icon: '📬' },
    { id: 'alt-4-strip', name: 'Alternating Strip', icon: '🎞️' },
    { id: 'miles-apart', name: 'Miles Apart', icon: '🌍' },
    { id: 'split-minimal', name: 'Split Minimal', icon: '✂️' },
    { id: 'scrapbook', name: 'Scrapbook', icon: '📒' },
];

// ─── Frame Themes (like polaroidbooth Studio > Frames) ─────────
export const FRAME_THEMES = [
    { id: 'classic-white', name: 'Classic White', color: '#FFFFFF', textColor: '#2d2d2d', isNew: false },
    { id: 'dark-mode', name: 'Dark Mode', color: '#1A1A1A', textColor: '#eeeeee', isNew: true },
    { id: 'vintage-cream', name: 'Vintage Cream', color: '#F5E6C8', textColor: '#5C4B3A', isNew: false },
    { id: 'soft-pink', name: 'Soft Pink', color: '#FFD6E7', textColor: '#8B2252', isNew: true },
    { id: 'sage-green', name: 'Sage Green', color: '#C8DAC5', textColor: '#2A4D2A', isNew: false },
    { id: 'midnight-blue', name: 'Midnight', color: '#0D1B2A', textColor: '#8BB8E8', isNew: true },
    { id: 'kraft', name: 'Kraft Paper', color: '#C4A882', textColor: '#3E281A', isNew: false },
    { id: 'lavender', name: 'Lavender', color: '#E8DEF8', textColor: '#4A0080', isNew: true },
    { id: 'custom', name: 'Custom', color: null, textColor: '#333333', isNew: false },
];

// ─── Sticker Packs (like picapicabooth Stickers) ────────────────
export const STICKER_PACKS = [
    {
        id: 'none',
        name: 'No Stickers',
        icon: '🚫',
        stickers: [],
    },
    {
        id: 'cute',
        name: 'Cute',
        icon: '🩷',
        stickers: ['💕', '✨', '🌸', '⭐', '🦋', '🍓', '🌺', '🎀'],
    },
    {
        id: 'animals',
        name: 'Animals',
        icon: '🐾',
        stickers: ['🐶', '🐱', '🐸', '🦊', '🐼', '🐰', '🦋', '🐢'],
    },
    {
        id: 'stars',
        name: 'Stars',
        icon: '⭐',
        stickers: ['⭐', '🌟', '✨', '💫', '🌙', '☀️', '🌠', '🌌'],
    },
    {
        id: 'goofy',
        name: 'Goofy',
        icon: '🤪',
        stickers: ['🤪', '😜', '🥴', '👾', '🤡', '💀', '🫨', '🤯'],
    },
    {
        id: 'cozy',
        name: 'Cozy',
        icon: '☕',
        stickers: ['☕', '🕯️', '📚', '🧸', '🍵', '🧣', '🌧️', '🎋'],
    },
    {
        id: 'film',
        name: 'Film',
        icon: '🎞️',
        stickers: ['🎞️', '📷', '🎬', '📽️', '🎥', '🎭', '🎨', '🖼️'],
    },
    {
        id: 'nature',
        name: 'Nature',
        icon: '🌿',
        stickers: ['🌿', '🍃', '🌸', '🌺', '🌻', '🍀', '🌱', '🌾'],
    },
    {
        id: 'galaxy',
        name: 'Galaxy',
        icon: '🚀',
        stickers: ['🚀', '🛸', '👽', '🌍', '🪐', '🌌', '🔭', '💫'],
    },
    {
        id: 'halloween',
        name: 'Spooky',
        icon: '👻',
        stickers: ['👻', '🦇', '🕷️', '🎃', '💀', '🕸️', '🖤', '🌙'],
    },
    {
        id: 'jellycat',
        name: 'Jellycat',
        icon: '🐰',
        stickers: ['🐰', '🐻', '🐼', '🐨', '🐸', '🦊', '🐶', '🐱'],
    },
    {
        id: 'girlypop',
        name: 'Girlypop',
        icon: '💅',
        stickers: ['💅', '👄', '🪞', '👒', '💄', '🌷', '🩰', '🎀'],
    },
];

// ─── Legacy per-sticker list (for individual sticker picker) ────
export const STICKERS = [
    { id: 'tape', emoji: '🖇️', label: 'Tape' },
    { id: 'heart', emoji: '🤍', label: 'Heart' },
    { id: 'star', emoji: '⭐', label: 'Star' },
    { id: 'sparkle', emoji: '✨', label: 'Sparkle' },
    { id: 'filmburn', emoji: '🎞️', label: 'Film Burn' },
    { id: 'flower', emoji: '🌸', label: 'Flower' },
    { id: 'bow', emoji: '🎀', label: 'Bow' },
    { id: 'moon', emoji: '🌙', label: 'Moon' },
    { id: 'coffee', emoji: '☕', label: 'Coffee' },
    { id: 'leaf', emoji: '🍃', label: 'Leaf' },
];

// ─── Fonts ──────────────────────────────────────────────────────
export const FONTS = [
    { id: 'caveat', label: 'Handwritten', value: 'Caveat, cursive' },
    { id: 'nunito', label: 'Rounded', value: 'Nunito, sans-serif' },
    { id: 'playfair', label: 'Elegant', value: 'Playfair Display, serif' },
    { id: 'mono', label: 'Typewriter', value: 'Courier New, monospace' },
    { id: 'georgia', label: 'Classic', value: 'Georgia, serif' },
];

// ─── Frame Colors (legacy swatch list) ──────────────────────────
export const FRAME_COLORS = [
    { id: 'cream', label: 'Cream', value: '#fdf9f3' },
    { id: 'beige', label: 'Beige', value: '#f0e6d8' },
    { id: 'sage', label: 'Sage', value: '#c8d5c4' },
    { id: 'pink', label: 'Dusty Pink', value: '#f0d0c8' },
    { id: 'grey', label: 'Light Grey', value: '#d8d4d0' },
    { id: 'white', label: 'White', value: '#ffffff' },
    { id: 'black', label: 'Noir', value: '#1a1a1a' },
];

// ════════════════════════════════════════════════════════════════
//  composeLayout  –  Main composition entry point
// ════════════════════════════════════════════════════════════════
/**
 * @param {HTMLCanvasElement} outputCanvas
 * @param {string[]} frames       – base64 image URLs
 * @param {string}   layoutId
 * @param {object}   options      – all studio options
 */
export async function composeLayout(outputCanvas, frames, layoutId, options = {}) {
    const {
        frameColor = '#fdf9f3',
        caption = '',
        font = 'Caveat, cursive',
        grainIntensity = 0,
        timestamp = '',
        location = '',
        // Studio extras — selectedStickers replaces stickerPackId
        selectedStickers = [],   // array of emoji strings placed by user
        stickerPackId = 'none',  // legacy fallback
        textOverlay = '',
        textColor = '#ffffff',
        textSize = 28,
        textFont = 'Caveat, cursive',
        textBold = false,
    } = options;

    const ctx = outputCanvas.getContext('2d');

    const loadImage = (src) =>
        new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
        });

    const imgs = await Promise.all(frames.map(loadImage));

    ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);

    switch (layoutId) {
        case 'single-polaroid':
            await drawPolaroid(ctx, outputCanvas, imgs[0], frameColor, caption, font, timestamp, location);
            break;
        case '2-strip':
            await drawStrip(ctx, outputCanvas, imgs.slice(0, 2), 2, frameColor, caption, font, timestamp, location);
            break;
        case '3-strip':
            await drawStrip(ctx, outputCanvas, imgs.slice(0, 3), 3, frameColor, caption, font, timestamp, location);
            break;
        case '4-strip':
        case 'alt-4-strip':
            await drawStrip(ctx, outputCanvas, imgs.slice(0, 4), 4, frameColor, caption, font, timestamp, location);
            break;
        case 'square-collage':
            await drawCollage(ctx, outputCanvas, imgs.slice(0, 4), frameColor, caption, font, timestamp, location);
            break;
        case 'postcard':
            await drawPostcard(ctx, outputCanvas, imgs[0], frameColor, caption, font, timestamp, location);
            break;
        case 'borderless':
            await drawBorderless(ctx, outputCanvas, imgs[0]);
            break;
        case 'side-by-side':
        case 'split-minimal':
            await drawSideBySide(ctx, outputCanvas, imgs[0], imgs[1] || imgs[0], frameColor, caption, font, timestamp, location);
            break;
        case 'vertical-post':
        case 'miles-apart':
        case 'scrapbook':
            await drawVerticalDuo(ctx, outputCanvas, imgs[0], imgs[1] || imgs[0], frameColor, caption, font, timestamp, location);
            break;
        default:
            await drawPolaroid(ctx, outputCanvas, imgs[0], frameColor, caption, font, timestamp, location);
    }

    // ── Post-processing: Stickers ──
    // Prefer individually selected stickers; fall back to pack
    let stickersToPlace = selectedStickers || [];
    if (stickersToPlace.length === 0 && stickerPackId && stickerPackId !== 'none') {
        const pack = STICKER_PACKS.find(p => p.id === stickerPackId);
        if (pack) stickersToPlace = pack.stickers;
    }
    if (stickersToPlace.length > 0) {
        drawStickers(ctx, outputCanvas, stickersToPlace);
    }

    // ── Post-processing: Text Overlay ──
    if (textOverlay && textOverlay.trim()) {
        drawTextOverlay(ctx, outputCanvas, textOverlay, textFont, textColor, textSize, textBold);
    }

    // ── Post-processing: Grain ──
    if (grainIntensity > 0) {
        applyGrain(ctx, outputCanvas, grainIntensity);
    }
}

// ════════════════════════════════════════════════════════════════
//  Layout drawing functions
// ════════════════════════════════════════════════════════════════

/** Draws caption / timestamp / location in the bottom strip of a polaroid */
function drawCaption(ctx, canvas, caption, font, timestamp, location, captionH) {
    const y0 = canvas.height - captionH;
    const tc = '#333333';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 0;

    if (caption) {
        ctx.font = `bold 26px ${font}`;
        ctx.fillStyle = tc;
        ctx.fillText(caption, canvas.width / 2, y0 + captionH * 0.46);
    }
    const subParts = [timestamp, location].filter(Boolean).join('  •  ');
    if (subParts) {
        ctx.font = `13px Nunito, sans-serif`;
        ctx.fillStyle = 'rgba(80,80,80,0.75)';
        ctx.fillText(subParts, canvas.width / 2, y0 + captionH * 0.78);
    }
}

async function drawPolaroid(ctx, canvas, img, frameColor, caption, font, timestamp, location) {

    canvas.width = 520;
    canvas.height = 630;
    const pad = 30;
    const captionH = 90;
    const imgH = canvas.height - pad * 2 - captionH;

    // Background
    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Inner white card with subtle shadow
    ctx.shadowColor = 'rgba(0,0,0,0.12)';
    ctx.shadowBlur = 16;
    ctx.fillStyle = 'white';
    ctx.fillRect(pad, pad, canvas.width - pad * 2, canvas.height - pad * 2);
    ctx.shadowBlur = 0;

    const ipad = 12;
    if (img) drawImageCover(ctx, img, pad + ipad, pad + ipad, canvas.width - (pad + ipad) * 2, imgH - ipad);

    drawCaption(ctx, canvas, caption, font, timestamp, location, captionH);
}

async function drawStrip(ctx, canvas, imgs, count, frameColor, caption, font, timestamp, location) {
    const pad = 18;
    const gap = 0;          // photos flush — no frame-colour seam between slots
    const captionH = 44;
    canvas.width = 380;
    // Make each slot 16:9 so camera frames fill without cropping extremes
    const frameW = canvas.width - pad * 2;
    const frameH = Math.round(frameW * (9 / 16));
    canvas.height = pad * 2 + frameH * count + gap * (count - 1) + captionH;

    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < count; i++) {
        const y = pad + i * (frameH + gap);
        if (imgs[i]) drawImageCover(ctx, imgs[i], pad, y, frameW, frameH);
    }

    // bottom caption area
    ctx.fillStyle = frameColor;
    ctx.fillRect(0, canvas.height - captionH, canvas.width, captionH);
    if (caption) {
        ctx.font = `20px ${font}`;
        ctx.fillStyle = resolveTextColor(frameColor);
        ctx.textAlign = 'center';
        ctx.fillText(caption, canvas.width / 2, canvas.height - 14);
    }
}

async function drawCollage(ctx, canvas, imgs, frameColor, caption, font, timestamp, location) {
    canvas.width = 520;
    canvas.height = 580;
    const pad = 20;
    const gap = 0;          // photos flush — no frame-colour seam between slots

    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cellW = (canvas.width - pad * 2) / 2;
    const cellH = (canvas.height - pad * 2 - 52) / 2;

    const positions = [
        [pad, pad],
        [pad + cellW, pad],
        [pad, pad + cellH],
        [pad + cellW, pad + cellH],
    ];
    for (let i = 0; i < 4; i++) {
        const [x, y] = positions[i];
        if (imgs[i]) drawImageCover(ctx, imgs[i], x, y, cellW, cellH);
    }

    if (caption) {
        ctx.font = `22px ${font}`;
        ctx.fillStyle = resolveTextColor(frameColor);
        ctx.textAlign = 'center';
        ctx.fillText(caption, canvas.width / 2, canvas.height - 14);
    }
}

async function drawPostcard(ctx, canvas, img, frameColor, caption, font, timestamp, location) {
    canvas.width = 740;
    canvas.height = 500;
    const tc = resolveTextColor(frameColor);
    const dim = dimColor(tc);

    // Background
    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle inner border
    ctx.strokeStyle = tc === '#ffffff' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

    const pad = 26;
    const imgW = Math.round(canvas.width * 0.56);
    const imgH = canvas.height - pad * 2;

    // Photo
    if (img) drawImageCover(ctx, img, pad, pad, imgW, imgH);

    // Thin photo border
    ctx.strokeStyle = tc === '#ffffff' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pad, pad, imgW, imgH);

    // ── Dividing line down the middle ──
    const divX = imgW + pad + 16;
    ctx.strokeStyle = tc === '#ffffff' ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.14)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(divX, pad + 8);
    ctx.lineTo(divX, canvas.height - pad - 8);
    ctx.stroke();
    ctx.setLineDash([]);

    // ── Right side: column A (address area) ──
    const colA = divX + 14;
    const colB = divX + 110;

    // Postcard header
    ctx.font = `bold italic 15px "Playfair Display", serif`;
    ctx.fillStyle = tc;
    ctx.textAlign = 'left';
    ctx.fillText('✉  Postcard', colA, pad + 22);

    // Thin separator under header
    ctx.strokeStyle = dim;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(colA, pad + 30);
    ctx.lineTo(canvas.width - pad, pad + 30);
    ctx.stroke();

    // ── Message / ruled lines area ──
    const LINE_COUNT = 5;
    const LINE_SPACING = 28;
    const firstLineY = pad + 62;
    const maxLineW = canvas.width - colA - pad - 8;

    // Always draw ruled lines first
    ctx.strokeStyle = dim;
    ctx.lineWidth = 0.7;
    for (let li = 0; li < LINE_COUNT; li++) {
        const ly = firstLineY + li * LINE_SPACING;
        ctx.beginPath();
        ctx.moveTo(colA, ly);
        ctx.lineTo(canvas.width - pad - 8, ly);
        ctx.stroke();
    }

    // Then draw caption TEXT on the lines (baseline 3px above each line)
    if (caption) {
        ctx.font = `italic 18px ${font}`;
        ctx.fillStyle = tc;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        const words = caption.split(' ');
        let line = '';
        let lineIdx = 0;
        for (const w of words) {
            if (lineIdx >= LINE_COUNT) break;
            const test = line + w + ' ';
            if (ctx.measureText(test).width > maxLineW && line) {
                ctx.fillText(line.trim(), colA + 2, firstLineY + lineIdx * LINE_SPACING - 3);
                line = w + ' ';
                lineIdx++;
            } else {
                line = test;
            }
        }
        if (line.trim() && lineIdx < LINE_COUNT) {
            ctx.fillText(line.trim(), colA + 2, firstLineY + lineIdx * LINE_SPACING - 3);
        }
    }


    // ── Address lines ──
    const addrY = canvas.height - 180;
    ctx.strokeStyle = dim;
    ctx.lineWidth = 0.7;
    for (let li = 0; li < 3; li++) {
        const ly = addrY + li * 30;
        ctx.beginPath();
        ctx.moveTo(colA, ly); ctx.lineTo(canvas.width - pad - 8, ly);
        ctx.stroke();
    }
    // "To:" label
    ctx.font = `10px Nunito, sans-serif`;
    ctx.fillStyle = dim;
    ctx.fillText('To:', colA, addrY - 10);

    if (timestamp) {
        ctx.font = `11px Nunito, sans-serif`;
        ctx.fillStyle = dim;
        ctx.fillText(timestamp, colA, addrY + 8);
    }
    if (location) {
        ctx.font = `11px Nunito, sans-serif`;
        ctx.fillStyle = dim;
        ctx.fillText('📍 ' + location, colA, addrY + 36);
    }

    // ── Stamp (top-right) ──
    const stampX = canvas.width - pad - 70;
    const stampY = pad + 2;
    const stampW = 62;
    const stampH = 70;

    // Perforated stamp border
    ctx.save();
    ctx.strokeStyle = tc === '#ffffff' ? 'rgba(255,255,255,0.45)' : 'rgba(120,80,40,0.45)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(stampX - 5, stampY - 5, stampW + 10, stampH + 10);
    ctx.setLineDash([]);
    // stamp fill
    ctx.fillStyle = tc === '#ffffff' ? 'rgba(255,255,255,0.12)' : 'rgba(180,140,100,0.2)';
    ctx.fillRect(stampX, stampY, stampW, stampH);
    ctx.font = '32px serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = tc === '#ffffff' ? 'rgba(255,255,255,0.8)' : 'rgba(100,70,30,0.7)';
    ctx.fillText('📸', stampX + stampW / 2, stampY + 46);
    ctx.font = `bold 7px Nunito, sans-serif`;
    ctx.fillStyle = tc === '#ffffff' ? 'rgba(255,255,255,0.5)' : 'rgba(100,70,30,0.5)';
    ctx.fillText('COZY BOOTH', stampX + stampW / 2, stampY + 62);
    ctx.restore();

    // ── Postmark circles ──
    ctx.save();
    ctx.strokeStyle = tc === '#ffffff' ? 'rgba(255,255,255,0.25)' : 'rgba(180,60,40,0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(stampX + stampW / 2, stampY + stampH / 2, 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(stampX + stampW / 2, stampY + stampH / 2, 24, 0, Math.PI * 2);
    ctx.stroke();
    // Wavy cancel lines
    for (let wi = 0; wi < 3; wi++) {
        const wx = stampX + stampW + 4 + wi * 0;
        ctx.beginPath();
        for (let xi = 0; xi < 40; xi++) {
            const px = stampX + stampW + 2 + xi;
            const py = stampY + 22 + wi * 10 + Math.sin(xi * 0.4) * 3;
            xi === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
    }
    ctx.restore();

    // ── Corner flourishes ──
    const corners = [[pad + 8, pad + 8], [canvas.width - pad - 8, pad + 8],
    [pad + 8, canvas.height - pad - 8], [canvas.width - pad - 8, canvas.height - pad - 8]];
    ctx.fillStyle = tc === '#ffffff' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.12)';
    corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();
    });
}

async function drawBorderless(ctx, canvas, img) {
    if (img) {
        canvas.width = img.naturalWidth || 640;
        canvas.height = img.naturalHeight || 480;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

async function drawSideBySide(ctx, canvas, imgA, imgB, frameColor, caption, font, timestamp, location) {
    canvas.width = 760;
    canvas.height = 440;
    const pad = 22;
    const gap = 14;
    const captionH = 50;
    const imgH = canvas.height - pad * 2 - captionH;
    const imgW = (canvas.width - pad * 2 - gap) / 2;

    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (imgA) drawImageCover(ctx, imgA, pad, pad, imgW, imgH);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(pad, pad, imgW, imgH);

    if (imgB) drawImageCover(ctx, imgB, pad + imgW + gap, pad, imgW, imgH);
    ctx.strokeRect(pad + imgW + gap, pad, imgW, imgH);

    if (caption) {
        ctx.font = `24px ${font}`;
        ctx.fillStyle = resolveTextColor(frameColor);
        ctx.textAlign = 'center';
        ctx.fillText(caption, canvas.width / 2, canvas.height - 14);
    }
}

async function drawVerticalDuo(ctx, canvas, imgA, imgB, frameColor, caption, font, timestamp, location) {
    canvas.width = 420;
    canvas.height = 680;
    const pad = 22;
    const gap = 14;
    const captionH = 60;
    const imgH = (canvas.height - pad * 2 - gap - captionH) / 2;

    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (imgA) drawImageCover(ctx, imgA, pad, pad, canvas.width - pad * 2, imgH);
    if (imgB) drawImageCover(ctx, imgB, pad, pad + imgH + gap, canvas.width - pad * 2, imgH);

    if (caption) {
        ctx.font = `24px ${font}`;
        ctx.fillStyle = resolveTextColor(frameColor);
        ctx.textAlign = 'center';
        ctx.fillText(caption, canvas.width / 2, canvas.height - 16);
    }
}

// ════════════════════════════════════════════════════════════════
//  Studio extras
// ════════════════════════════════════════════════════════════════

/**
 * Draw a sticker pack's emojis scattered around the corners/margins
 */
function drawStickers(ctx, canvas, stickers) {
    if (!stickers || stickers.length === 0) return;
    const w = canvas.width;
    const h = canvas.height;

    // Predefined scatter positions (corners + edges)
    const positions = [
        // Top-left cluster
        { x: 0.06, y: 0.04, size: 0.065, rot: -0.3 },
        { x: 0.13, y: 0.08, size: 0.045, rot: 0.2 },
        // Top-right cluster
        { x: 0.88, y: 0.05, size: 0.060, rot: 0.4 },
        { x: 0.80, y: 0.09, size: 0.040, rot: -0.2 },
        // Bottom-left
        { x: 0.05, y: 0.90, size: 0.055, rot: 0.3 },
        { x: 0.12, y: 0.95, size: 0.038, rot: -0.4 },
        // Bottom-right
        { x: 0.87, y: 0.88, size: 0.060, rot: -0.3 },
        { x: 0.78, y: 0.93, size: 0.042, rot: 0.2 },
    ];

    const used = stickers.slice(0, positions.length);

    used.forEach((emoji, i) => {
        const p = positions[i];
        const sz = Math.round(p.size * Math.min(w, h));
        const px = Math.round(p.x * w);
        const py = Math.round(p.y * h);

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(p.rot);
        ctx.font = `${sz}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 0, 0);
        ctx.restore();
    });
}

/**
 * Draw a text overlay in the lower-third / across the frame
 */
function drawTextOverlay(ctx, canvas, text, font, color, size, bold) {
    if (!text) return;
    const w = canvas.width;
    const h = canvas.height;

    const fontSize = Math.round((size / 100) * w * 0.45); // scale size by canvas width
    const weight = bold ? 'bold ' : '';
    ctx.font = `${weight}${fontSize}px ${font}`;
    ctx.fillStyle = color || '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    // Semi-transparent shadow for readability
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;

    // Position: 78% down the frame
    ctx.fillText(text, w / 2, Math.round(h * 0.78));
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
}

/**
 * Apply film grain overlay to the composed canvas
 */
function applyGrain(ctx, canvas, intensity) {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const amount = intensity * 35;
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * amount;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);
}

/** CSS object-fit:cover — draws img cropped/centered to fill (dx,dy,dw,dh) */
function drawImageCover(ctx, img, dx, dy, dw, dh) {
    if (!img) return;
    const iw = img.naturalWidth || img.width || dw;
    const ih = img.naturalHeight || img.height || dh;
    const scale = Math.max(dw / iw, dh / ih);
    const sw = dw / scale;
    const sh = dh / scale;
    const sx = (iw - sw) / 2;
    const sy = (ih - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

/** Choose dark or light text based on frame background */
function resolveTextColor(hex) {
    if (!hex || hex === 'null') return '#333333';
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    return lum > 160 ? '#333333' : '#f0f0f0';
}

function dimColor(hex) {
    return hex === '#f0f0f0' ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)';
}
