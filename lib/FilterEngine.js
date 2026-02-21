/**
 * FilterEngine.js
 * Applies canvas-based photo filters via ImageData manipulation.
 * All filters are parameterized by intensity (0-1).
 */

export const FILTERS = [
    // Film-Inspired
    { id: 'warm-vintage', name: 'Warm Vintage', category: 'film', emoji: '☀️' },
    { id: '90s-disposable', name: '90s Disposable', category: 'film', emoji: '📷' },
    { id: 'soft-film-fade', name: 'Soft Film Fade', category: 'film', emoji: '🎞️' },
    { id: 'grainy-retro', name: 'Grainy Retro', category: 'film', emoji: '📼' },
    { id: 'golden-hour', name: 'Golden Hour', category: 'film', emoji: '🌅' },
    // Cozy Indoor
    { id: 'warm-lamp', name: 'Warm Lamp', category: 'cozy', emoji: '🕯️' },
    { id: 'soft-cafe', name: 'Soft Café', category: 'cozy', emoji: '☕' },
    { id: 'dusty-window', name: 'Dusty Window', category: 'cozy', emoji: '🪟' },
    { id: 'faded-autumn', name: 'Faded Autumn', category: 'cozy', emoji: '🍂' },
    // Clean & Minimal
    { id: 'natural', name: 'Bright Natural', category: 'clean', emoji: '✨' },
    { id: 'soft-contrast', name: 'Soft Contrast', category: 'clean', emoji: '🤍' },
    { id: 'gentle-matte', name: 'Gentle Matte', category: 'clean', emoji: '🧺' },
    { id: 'cream-tone', name: 'Cream Tone', category: 'clean', emoji: '🍦' },
    // Moody
    { id: 'deep-shadow', name: 'Deep Shadow', category: 'moody', emoji: '🌑' },
    { id: 'midnight-film', name: 'Midnight Film', category: 'moody', emoji: '🌙' },
    { id: 'muted-blue', name: 'Muted Blue', category: 'moody', emoji: '🌊' },
    { id: 'urban-grey', name: 'Urban Grey', category: 'moody', emoji: '🏙️' },
    // B&W
    { id: 'classic-bw', name: 'Classic B&W', category: 'bw', emoji: '🖤' },
    { id: 'high-contrast', name: 'High Contrast', category: 'bw', emoji: '◼' },
    { id: 'soft-mono', name: 'Soft Portrait Mono', category: 'bw', emoji: '🩶' },
];

export const FILTER_CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'film', label: '🎞️ Film' },
    { id: 'cozy', label: '☕ Cozy' },
    { id: 'clean', label: '✨ Clean' },
    { id: 'moody', label: '🌙 Moody' },
    { id: 'bw', label: '🖤 B&W' },
];

/**
 * Apply a filter to a canvas 2D context given ImageData.
 * Returns modified ImageData.
 */
export function applyFilter(imageData, filterId, intensity = 1.0) {
    const data = new Uint8ClampedArray(imageData.data);
    const t = intensity; // 0..1

    switch (filterId) {
        case 'warm-vintage': applyWarmVintage(data, t); break;
        case '90s-disposable': apply90sDisposable(data, t); break;
        case 'soft-film-fade': applySoftFilmFade(data, t); break;
        case 'grainy-retro': applyGrainyRetro(data, t); break;
        case 'golden-hour': applyGoldenHour(data, t); break;
        case 'warm-lamp': applyWarmLamp(data, t); break;
        case 'soft-cafe': applySoftCafe(data, t); break;
        case 'dusty-window': applyDustyWindow(data, t); break;
        case 'faded-autumn': applyFadedAutumn(data, t); break;
        case 'natural': applyNatural(data, t); break;
        case 'soft-contrast': applySoftContrast(data, t); break;
        case 'gentle-matte': applyGentleMatte(data, t); break;
        case 'cream-tone': applyCreamTone(data, t); break;
        case 'deep-shadow': applyDeepShadow(data, t); break;
        case 'midnight-film': applyMidnightFilm(data, t); break;
        case 'muted-blue': applyMutedBlue(data, t); break;
        case 'urban-grey': applyUrbanGrey(data, t); break;
        case 'classic-bw': applyClassicBW(data, t); break;
        case 'high-contrast': applyHighContrast(data, t); break;
        case 'soft-mono': applySoftMono(data, t); break;
        default: break;
    }

    return new ImageData(data, imageData.width, imageData.height);
}

// ── Helpers ───────────────────────────────────────────────────
function clamp(v) { return Math.max(0, Math.min(255, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function mix(original, filtered, t) { return lerp(original, filtered, t); }

function toGray(r, g, b) { return 0.299 * r + 0.587 * g + 0.114 * b; }

function addNoise(v, amount) {
    return clamp(v + (Math.random() - 0.5) * amount * 60);
}

function applyContrast(r, g, b, factor) {
    return [
        clamp(factor * (r - 128) + 128),
        clamp(factor * (g - 128) + 128),
        clamp(factor * (b - 128) + 128),
    ];
}

function applyVignette(data, width, height, strength) {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const dx = (x / width - 0.5) * 2;
            const dy = (y / height - 0.5) * 2;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const vig = Math.max(0, 1 - dist * strength);
            data[i] = clamp(data[i] * vig);
            data[i + 1] = clamp(data[i + 1] * vig);
            data[i + 2] = clamp(data[i + 2] * vig);
        }
    }
}

// ── Filter Implementations ────────────────────────────────────
function applyWarmVintage(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        data[i] = clamp(mix(r, r * 1.12 + 15, t));
        data[i + 1] = clamp(mix(g, g * 1.02 + 5, t));
        data[i + 2] = clamp(mix(b, b * 0.80 - 10, t));
    }
}

function apply90sDisposable(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const nr = mix(r, clamp(r * 1.05 + 25), t);
        const ng = mix(g, clamp(g * 0.95 + 10), t);
        const nb = mix(b, clamp(b * 0.85 + 5), t);
        data[i] = addNoise(nr, t * 0.3);
        data[i + 1] = addNoise(ng, t * 0.3);
        data[i + 2] = addNoise(nb, t * 0.3);
    }
}

function applySoftFilmFade(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        data[i] = clamp(mix(r, r * 0.92 + 30, t));
        data[i + 1] = clamp(mix(g, g * 0.90 + 28, t));
        data[i + 2] = clamp(mix(b, b * 0.88 + 26, t));
    }
}

function applyGrainyRetro(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const gray = toGray(r, g, b);
        const mr = mix(r, gray * 1.05 + 10, t * 0.5);
        const mg = mix(g, gray * 0.95 + 5, t * 0.5);
        const mb = mix(b, gray * 0.85, t * 0.5);
        data[i] = addNoise(mr, t * 0.5);
        data[i + 1] = addNoise(mg, t * 0.5);
        data[i + 2] = addNoise(mb, t * 0.5);
    }
}

function applyGoldenHour(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        data[i] = clamp(mix(r, r * 1.15 + 20, t));
        data[i + 1] = clamp(mix(g, g * 1.05 + 8, t));
        data[i + 2] = clamp(mix(b, b * 0.75, t));
    }
}

function applyWarmLamp(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        data[i] = clamp(mix(r, r * 1.10 + 18, t));
        data[i + 1] = clamp(mix(g, g * 0.97 + 5, t));
        data[i + 2] = clamp(mix(b, b * 0.70 - 5, t));
    }
}

function applySoftCafe(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        data[i] = clamp(mix(r, r * 1.06 + 10, t));
        data[i + 1] = clamp(mix(g, g * 1.00 + 4, t));
        data[i + 2] = clamp(mix(b, b * 0.84 + 8, t));
    }
}

function applyDustyWindow(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const gray = toGray(r, g, b);
        data[i] = clamp(mix(r, gray * 0.9 + 30, t));
        data[i + 1] = clamp(mix(g, gray * 0.9 + 28, t));
        data[i + 2] = clamp(mix(b, gray * 0.95 + 26, t));
    }
}

function applyFadedAutumn(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        data[i] = clamp(mix(r, r * 1.08 + 12, t));
        data[i + 1] = clamp(mix(g, g * 0.92 + 6, t));
        data[i + 2] = clamp(mix(b, b * 0.75 + 4, t));
    }
}

function applyNatural(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        data[i] = clamp(mix(r, clamp(r * 1.04 + 5), t));
        data[i + 1] = clamp(mix(g, clamp(g * 1.04 + 5), t));
        data[i + 2] = clamp(mix(b, clamp(b * 1.04 + 5), t));
    }
}

function applySoftContrast(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const [cr, cg, cb] = applyContrast(r, g, b, 1.15);
        data[i] = clamp(mix(r, cr, t));
        data[i + 1] = clamp(mix(g, cg, t));
        data[i + 2] = clamp(mix(b, cb, t));
    }
}

function applyGentleMatte(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        data[i] = clamp(mix(r, r * 0.88 + 24, t));
        data[i + 1] = clamp(mix(g, g * 0.88 + 24, t));
        data[i + 2] = clamp(mix(b, b * 0.88 + 24, t));
    }
}

function applyCreamTone(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        data[i] = clamp(mix(r, r * 1.04 + 8, t));
        data[i + 1] = clamp(mix(g, g * 1.01 + 6, t));
        data[i + 2] = clamp(mix(b, b * 0.92 + 12, t));
    }
}

function applyDeepShadow(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const [cr, cg, cb] = applyContrast(r, g, b, 1.3);
        data[i] = clamp(mix(r, cr * 0.82, t));
        data[i + 1] = clamp(mix(g, cg * 0.78, t));
        data[i + 2] = clamp(mix(b, cb * 0.85, t));
    }
}

function applyMidnightFilm(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        data[i] = clamp(mix(r, r * 0.72 + 5, t));
        data[i + 1] = clamp(mix(g, g * 0.78 + 8, t));
        data[i + 2] = clamp(mix(b, b * 0.95 + 15, t));
    }
}

function applyMutedBlue(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        data[i] = clamp(mix(r, r * 0.82, t));
        data[i + 1] = clamp(mix(g, g * 0.88 + 5, t));
        data[i + 2] = clamp(mix(b, b * 1.12 + 10, t));
    }
}

function applyUrbanGrey(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const gray = toGray(r, g, b);
        const [cr, cg, cb] = applyContrast(gray, gray, gray, 1.05);
        data[i] = clamp(mix(r, cr + 8, t));
        data[i + 1] = clamp(mix(g, cg + 8, t));
        data[i + 2] = clamp(mix(b, cb + 12, t));
    }
}

function applyClassicBW(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const gray = toGray(data[i], data[i + 1], data[i + 2]);
        data[i] = clamp(mix(data[i], gray, t));
        data[i + 1] = clamp(mix(data[i + 1], gray, t));
        data[i + 2] = clamp(mix(data[i + 2], gray, t));
    }
}

function applyHighContrast(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const gray = toGray(data[i], data[i + 1], data[i + 2]);
        const [cr, cg, cb] = applyContrast(gray, gray, gray, 1.5);
        data[i] = clamp(mix(data[i], cr, t));
        data[i + 1] = clamp(mix(data[i + 1], cg, t));
        data[i + 2] = clamp(mix(data[i + 2], cb, t));
    }
}

function applySoftMono(data, t) {
    for (let i = 0; i < data.length; i += 4) {
        const gray = toGray(data[i], data[i + 1], data[i + 2]);
        const soft = gray * 0.92 + 18;
        data[i] = clamp(mix(data[i], soft, t));
        data[i + 1] = clamp(mix(data[i + 1], soft, t));
        data[i + 2] = clamp(mix(data[i + 2], soft, t));
    }
}
