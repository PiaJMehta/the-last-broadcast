import React, { useState, useCallback, useEffect } from 'react';

var HANDLE = '@_thelastbroadcast_';
var HANDLE_CHARS = HANDLE.split('');
var CORRECT_ORDER = HANDLE_CHARS.map(function (_, i) { return i; });

var PUZZLE_TITLES = [
    'The Signal', 'End of Days', 'Static Web', 'Whispers', 'Deep Abyss',
    'Phantom Ray', 'Requiem', 'The Drift', 'Last Tower', 'Cipher Ring',
    'Exodus File', 'Breach Point', 'Vertex Core', 'Omega Level', 'Aurora Sky',
    'Mirage City', 'Vortex Math', 'Zenith Path', 'Epoch Era',
];

var PUZZLE_AUTHORS = [
    'H. Melville', 'G. Orwell', 'A. Huxley', 'M. Shelley', 'J. Austen',
    'C. Bronte', 'E. Bronte', 'B. Stoker', 'H. Lee', 'F. Dostoevsky',
    'V. Hugo', 'D. Alighieri', 'L. Tolstoy', 'J. Salinger', 'R. Bradbury',
    'W. Golding', 'F. Kafka', 'I. Asimov', 'A. Clarke'
];

// Heights: dramatic variation (120–220px), 19 entries
var PUZZLE_BOOKS = HANDLE_CHARS.map(function (ch, i) {
    return {
        char: ch,
        title: PUZZLE_TITLES[i],
        author: PUZZLE_AUTHORS[i],
        h: [170, 140, 200, 130, 215, 150, 190, 120, 220, 135, 180, 125, 205, 160, 195, 145, 210, 155, 185][i],
        w: [48, 42, 52, 38, 54, 44, 50, 36, 52, 40, 46, 34, 50, 44, 48, 38, 52, 42, 46][i],
    };
});

var DECOY_AUTHORS = [
    'H.G. Wells', 'J. Verne', 'E.A. Poe', 'A.C. Doyle', 'M. Twain', 'C. Dickens',
    'J. London', 'R. Stevenson', 'O. Wilde', 'A. Dumas', 'J. Swift', 'H. James',
    'T. Hardy', 'J. Conrad', 'W. Whitman', 'E. Dickinson', 'J. Joyce', 'V. Woolf',
    'E. Hemingway', 'F. Fitzgerald', 'W. Faulkner', 'S. Beckett', 'G. Marquez', 'J. Borges',
    'R. Frost', 'T.S. Eliot', 'E. Pound', 'W. Yeats', 'J. Keats', 'P. Shelley',
    'Lord Byron', 'W. Wordsworth', 'S. Coleridge', 'W. Blake', 'R. Burns', 'J. Milton'
];

var DECOY_POOL = [
    { title: 'Redacted', h: 175 }, { title: 'Null Space', h: 125 }, { title: 'The Void', h: 210 },
    { title: 'Ether Waves', h: 135 }, { title: 'Dead Skies', h: 195 }, { title: 'Lost World', h: 155 },
    { title: 'Sigma Rule', h: 130 }, { title: 'Decay Mode', h: 205 }, { title: 'The Relic', h: 140 },
    { title: 'Purged', h: 215 }, { title: 'Haze Factor', h: 120 }, { title: 'Flux Theory', h: 165 },
    { title: 'Gloom State', h: 185 }, { title: 'Nadir Point', h: 130 }, { title: 'Ruined Scape', h: 210 },
    { title: 'Burn Order', h: 125 }, { title: 'Dusk Patrol', h: 190 }, { title: 'Ash Fall', h: 135 },
    { title: 'Echo Chamber', h: 200 }, { title: 'Bleak House', h: 145 }, { title: 'Shard Glass', h: 120 },
    { title: 'Fault Lines', h: 195 }, { title: 'Noise Floor', h: 135 }, { title: 'Waning Moon', h: 180 },
    { title: 'Murk Waters', h: 170 }, { title: 'Smog City', h: 220 }, { title: 'Wreck Diver', h: 125 },
    { title: 'Rust Belt', h: 205 }, { title: 'Vapor Trails', h: 140 }, { title: 'Tomb Seals', h: 160 },
    { title: 'True Grit', h: 120 }, { title: 'Blight Lands', h: 210 }, { title: 'Hollow Earth', h: 150 },
    { title: 'Pyre Flame', h: 130 }, { title: 'Slag Piles', h: 190 }, { title: 'Cinder Dust', h: 140 },
].map(function (d, i) { d.author = DECOY_AUTHORS[i]; return d; });

// 3 shelves: 7+6+6 puzzle books = 19 total
var STATIC_LAYOUT = [
    [
        { type: 'decoy', idx: 0 },
        { type: 'puzzle', slot: 0 },
        { type: 'decoy', idx: 1 },
        { type: 'puzzle', slot: 1 },
        { type: 'decoy', idx: 2 },
        { type: 'puzzle', slot: 2 },
        { type: 'decoy', idx: 3 }, { type: 'decoy', idx: 4 },
        { type: 'puzzle', slot: 3 },
        { type: 'decoy', idx: 5 },
        { type: 'puzzle', slot: 4 },
        { type: 'decoy', idx: 6 }, { type: 'decoy', idx: 7 },
        { type: 'puzzle', slot: 5 },
        { type: 'decoy', idx: 8 },
        { type: 'puzzle', slot: 6 },
        { type: 'decoy', idx: 9 }, { type: 'decoy', idx: 10 },
    ],
    [
        { type: 'decoy', idx: 11 }, { type: 'decoy', idx: 12 },
        { type: 'puzzle', slot: 7 },
        { type: 'decoy', idx: 13 },
        { type: 'puzzle', slot: 8 },
        { type: 'decoy', idx: 14 }, { type: 'decoy', idx: 15 },
        { type: 'puzzle', slot: 9 },
        { type: 'decoy', idx: 16 },
        { type: 'puzzle', slot: 10 },
        { type: 'decoy', idx: 17 }, { type: 'decoy', idx: 18 },
        { type: 'puzzle', slot: 11 },
        { type: 'decoy', idx: 19 },
        { type: 'puzzle', slot: 12 },
        { type: 'decoy', idx: 20 }, { type: 'decoy', idx: 21 },
        { type: 'decoy', idx: 22 },
    ],
    [
        { type: 'decoy', idx: 23 },
        { type: 'puzzle', slot: 13 },
        { type: 'decoy', idx: 24 }, { type: 'decoy', idx: 25 },
        { type: 'puzzle', slot: 14 },
        { type: 'decoy', idx: 26 },
        { type: 'puzzle', slot: 15 },
        { type: 'decoy', idx: 27 }, { type: 'decoy', idx: 28 },
        { type: 'puzzle', slot: 16 },
        { type: 'decoy', idx: 29 },
        { type: 'puzzle', slot: 17 },
        { type: 'decoy', idx: 30 }, { type: 'decoy', idx: 31 },
        { type: 'puzzle', slot: 18 },
        { type: 'decoy', idx: 32 }, { type: 'decoy', idx: 33 },
        { type: 'decoy', idx: 34 },
    ],
];

var STORAGE_KEY = 'bookshelf_puzzle_v5';

// Deterministic pseudo-random from seed
function sv(seed) {
    var x = Math.sin(seed * 9301 + 4927) * 49297;
    return x - Math.floor(x);
}

// ── MUTED COVER COLOR PALETTES ──────────────────────────────────
// dark reds, deep teals, dusty purples, olive greens, navy blues
var COVER_PALETTES = [
    { base: '#1a0e0e', mid: '#1f1212', light: '#281818' }, // dark crimson
    { base: '#0e1518', mid: '#12191e', light: '#182226' }, // deep teal
    { base: '#14101a', mid: '#1a1422', light: '#201a2a' }, // dusty purple
    { base: '#12140e', mid: '#181a12', light: '#1e2018' }, // olive green
    { base: '#0e1018', mid: '#12141e', light: '#181c26' }, // navy blue
    { base: '#181410', mid: '#1e1a14', light: '#24201a' }, // aged brown
    { base: '#100e14', mid: '#161220', light: '#1c1828' }, // plum
    { base: '#0e1614', mid: '#121c1a', light: '#182420' }, // dark sea green
    { base: '#18100e', mid: '#1e1412', light: '#261a18' }, // burnt sienna
    { base: '#101218', mid: '#14181e', light: '#1a1e26' }, // slate blue
    { base: '#14100e', mid: '#1a1412', light: '#221a16' }, // mahogany
    { base: '#0e1416', mid: '#121a1e', light: '#182024' }, // teal shadow
];

// Which books lean dramatically (indices into overall item position)
var LEANING_SEEDS = [7, 22, 35]; // 3 books lean more

function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = a[i]; a[i] = a[j]; a[j] = temp;
    }
    if (a.every(function (v, i) { return v === CORRECT_ORDER[i]; })) {
        var t = a[0]; a[0] = a[a.length - 1]; a[a.length - 1] = t;
    }
    return a;
}

function loadState() {
    try {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            var p = JSON.parse(saved);
            if (p && p.books && Array.isArray(p.books) && p.books.length === CORRECT_ORDER.length) {
                return { books: p.books, solved: Boolean(p.solved) };
            }
        }
    } catch (e) { /* ignore */ }
    return null;
}

export default function Bookshelf() {
    var initial = loadState();
    var _b = useState(initial ? initial.books : shuffle(CORRECT_ORDER.slice()));
    var books = _b[0], setBooks = _b[1];
    var _s = useState(initial ? initial.solved : false);
    var solved = _s[0], setSolved = _s[1];
    var _d = useState(null);
    var dragSlot = _d[0], setDragSlot = _d[1];
    var _o = useState(null);
    var overSlot = _o[0], setOverSlot = _o[1];
    var _n = useState(null);
    var nextTarget = _n[0], setNextTarget = _n[1];
    var _nd = useState(null);
    var nextDest = _nd[0], setNextDest = _nd[1];
    var _dp = useState('idle');
    var drawerPhase = _dp[0], setDrawerPhase = _dp[1];
    var _sr = useState(false);
    var showReveal = _sr[0], setShowReveal = _sr[1];

    useEffect(function () {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ books: books, solved: solved }));
    }, [books, solved]);

    useEffect(function () {
        if (solved) { setNextTarget(null); setNextDest(null); return; }
        for (var i = 0; i < CORRECT_ORDER.length; i++) {
            if (books[i] !== CORRECT_ORDER[i]) {
                setNextTarget(books.indexOf(CORRECT_ORDER[i]));
                setNextDest(i);
                return;
            }
        }
        setSolved(true); setNextTarget(null); setNextDest(null);
    }, [books, solved]);

    useEffect(function () {
        if (solved && drawerPhase === 'idle') {
            var t = setTimeout(function () { setDrawerPhase('sliding'); }, 400);
            return function () { clearTimeout(t); };
        }
        if (drawerPhase === 'sliding') {
            var t2 = setTimeout(function () { setDrawerPhase('revealed'); setShowReveal(true); }, 1800);
            return function () { clearTimeout(t2); };
        }
    }, [solved, drawerPhase]);

    var onDragStart = useCallback(function (e, slot) {
        if (solved) return;
        setDragSlot(slot);
        e.dataTransfer.effectAllowed = 'move';
        var img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        e.dataTransfer.setDragImage(img, 0, 0);
    }, [solved]);

    var onDragOverSlot = useCallback(function (e, slot) {
        e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setOverSlot(slot);
    }, []);

    var onDrop = useCallback(function (e, slot) {
        e.preventDefault();
        if (dragSlot === null || dragSlot === slot) { setDragSlot(null); setOverSlot(null); return; }
        setBooks(function (prev) {
            var next = prev.slice();
            var tmp = next[dragSlot]; next[dragSlot] = next[slot]; next[slot] = tmp;
            return next;
        });
        setDragSlot(null); setOverSlot(null);
    }, [dragSlot]);

    var onDragEnd = useCallback(function () { setDragSlot(null); setOverSlot(null); }, []);

    function handleReset() {
        setBooks(shuffle(CORRECT_ORDER.slice()));
        setSolved(false); setShowReveal(false); setDrawerPhase('idle');
        localStorage.removeItem(STORAGE_KEY);
    }

    // ══════════════════════════════════════════════════════════════
    // BOOK SPINE STYLING
    // ══════════════════════════════════════════════════════════════

    function getSpineStyle(h, seed) {
        var s1 = sv(seed);
        var s2 = sv(seed + 77);
        var pal = COVER_PALETTES[Math.floor(s1 * COVER_PALETTES.length)];

        // Tilt: most books ±1.5°, a few lean 4-6°
        var isLeaner = LEANING_SEEDS.indexOf(seed % 54) !== -1;
        var tilt = isLeaner
            ? (s2 > 0.5 ? 4 + s2 * 2 : -(4 + s2 * 2))
            : (s2 - 0.5) * 3;

        return {
            height: h + 'px',
            marginRight: Math.floor(s2 * 4) + 'px',
            position: 'relative',
            borderRadius: '2px 3px 3px 2px',
            overflow: 'hidden',
            // The cover — vertical gradient simulating aged leather/cloth
            background:
                'linear-gradient(180deg, ' +
                pal.light + ' 0%, ' +
                pal.mid + ' 6%, ' +
                pal.base + ' 15%, ' +
                pal.mid + ' 50%, ' +
                pal.base + ' 85%, ' +
                pal.mid + ' 94%, ' +
                pal.light + ' 100%)',
            transform: 'rotate(' + tilt.toFixed(1) + 'deg)',
            transformOrigin: 'bottom center',
            boxShadow:
                '3px 6px 12px rgba(0,0,0,0.9), ' +
                '1px 2px 4px rgba(0,0,0,0.6), ' +
                'inset 3px 0 6px rgba(0,0,0,0.4), ' +
                'inset -1px 0 3px rgba(255,255,255,0.02)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        };
    }

    // ── Page edges, Spine binding, Depth strip, Worn texture ──
    function BookDetails(props) {
        var pal = COVER_PALETTES[Math.floor(sv(props.seed) * COVER_PALETTES.length)];
        return React.createElement(React.Fragment, null,
            // ── PAGE EDGES (top) — cream/off-white horizontal band ──
            React.createElement('div', {
                style: {
                    position: 'absolute', top: 0, left: '3px', right: '1px', height: '4px',
                    background: 'linear-gradient(180deg, rgba(200,190,170,0.12) 0%, rgba(180,170,150,0.06) 60%, transparent 100%)',
                    borderBottom: '1px solid rgba(160,150,130,0.05)',
                }
            }),
            // Thin page lines inside the top band
            React.createElement('div', {
                style: {
                    position: 'absolute', top: '1px', left: '5px', right: '3px', height: '0px',
                    borderTop: '1px solid rgba(200,190,170,0.08)',
                }
            }),
            React.createElement('div', {
                style: {
                    position: 'absolute', top: '2.5px', left: '5px', right: '3px', height: '0px',
                    borderTop: '1px solid rgba(200,190,170,0.05)',
                }
            }),
            // ── PAGE EDGES (bottom) ──
            React.createElement('div', {
                style: {
                    position: 'absolute', bottom: 0, left: '3px', right: '1px', height: '3px',
                    background: 'linear-gradient(0deg, rgba(200,190,170,0.08) 0%, transparent 100%)',
                }
            }),
            // ── LEFT SPINE BINDING — thick dark edge ──
            React.createElement('div', {
                style: {
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 15%, rgba(0,0,0,0.15) 85%, rgba(0,0,0,0.6) 100%)',
                    borderRight: '1px solid rgba(255,255,255,0.04)',
                }
            }),
            // ── RIGHT DEPTH STRIP — thin lighter edge for 3D ──
            React.createElement('div', {
                style: {
                    position: 'absolute', right: 0, top: '4px', bottom: '3px', width: '2px',
                    background: 'linear-gradient(180deg, ' + pal.light + ' 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.03) 70%, ' + pal.light + ' 100%)',
                }
            }),
            // ── WORN TEXTURE — horizontal grain lines ──
            React.createElement('div', {
                style: {
                    position: 'absolute', inset: 0,
                    background: 'repeating-linear-gradient(180deg, transparent 0px, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)',
                    pointerEvents: 'none',
                }
            }),
            // ── Faint vertical crease lines (aged wear) ──
            React.createElement('div', {
                style: {
                    position: 'absolute', inset: 0,
                    background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 8px, rgba(0,0,0,0.02) 8px, rgba(0,0,0,0.02) 9px)',
                    pointerEvents: 'none',
                }
            })
        );
    }

    // ── Spine title text ──
    function SpineTitle(props) {
        var baseColor = props.target ? '#39ff14' : (props.color || '#e8dcb8');
        return React.createElement('div', {
            style: {
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
                flex: 1, padding: '10px 0',
                zIndex: 1, height: '100%', boxSizing: 'border-box'
            }
        },
            // Title
            React.createElement('div', {
                style: {
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    color: baseColor,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    textTransform: 'none',
                    letterSpacing: '1px',
                    whiteSpace: 'nowrap',
                    textShadow: props.glow
                        ? '0 0 8px rgba(57,255,20,0.5), 0 0 16px rgba(57,255,20,0.25)'
                        : '1px 1px 2px rgba(0,0,0,0.8)',
                    transition: 'color 0.3s, text-shadow 0.3s',
                    overflow: 'hidden', textOverflow: 'ellipsis'
                }
            }, props.text),

            // Author
            !props.isCorrect && React.createElement('div', {
                style: {
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    fontSize: '6.5px',
                    color: 'rgba(232, 220, 184, 0.6)',
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontStyle: 'italic',
                    whiteSpace: 'nowrap',
                    marginTop: '8px'
                }
            }, props.author),

            // Publisher mark
            !props.isCorrect && React.createElement('div', {
                style: {
                    fontSize: '10px',
                    color: 'rgba(232, 220, 184, 0.4)',
                    marginTop: 'auto',
                    marginBottom: '4px',
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    writingMode: 'horizontal-tb',
                    transform: 'rotate(90deg)'
                }
            }, '❧')
        );
    }

    // ── Revealed character ──
    function RevealedChar(props) {
        return React.createElement('div', {
            style: {
                fontSize: '22px', fontWeight: 'bold',
                color: '#39ff14',
                fontFamily: "'Share Tech Mono', monospace",
                textShadow: '0 0 14px rgba(57,255,20,0.7), 0 0 30px rgba(57,255,20,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flex: 1,
                animation: 'letterPop 0.4s ease-out both',
                zIndex: 1,
            }
        }, props.char);
    }

    // ══════════════════════════════════════════════════════════════
    // PUZZLE BOOK
    // ══════════════════════════════════════════════════════════════
    function renderPuzzleBook(slot) {
        var bookDataIdx = books[slot];
        if (bookDataIdx === undefined || bookDataIdx === null) return null;
        var data = PUZZLE_BOOKS[bookDataIdx];
        if (!data) return null;
        var isCorrect = books[slot] === CORRECT_ORDER[slot];
        var isTarget = nextTarget === slot;
        var isDragging = dragSlot === slot;
        var isOver = overSlot === slot && dragSlot !== null && dragSlot !== slot && slot === nextDest;

        var base = getSpineStyle(data.h, slot + 50);
        var style = Object.assign({}, base, {
            width: data.w + 'px',
            flexShrink: 0,
            userSelect: 'none',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: isTarget && !solved ? 'grab' : 'default',
            opacity: isDragging ? 0.2 : 1,
            transform: (isOver ? 'scale(1.05) translateY(-8px) ' : isDragging ? 'scale(0.9) ' : '') + base.transform,
            border: isTarget && !solved
                ? '1px solid rgba(57,255,20,0.6)'
                : isCorrect
                    ? '1px solid rgba(57,255,20,0.2)'
                    : isOver
                        ? '1px solid rgba(57,255,20,0.3)'
                        : '1px solid rgba(255,255,255,0.03)',
            // Green aura that BLEEDS into neighbors for target book
            boxShadow: isTarget && !solved
                ? '0 0 24px 8px rgba(57,255,20,0.25), 0 0 48px 16px rgba(57,255,20,0.08), ' + base.boxShadow
                : isOver
                    ? '0 0 16px rgba(57,255,20,0.15), ' + base.boxShadow
                    : base.boxShadow,
        });

        return React.createElement('div', {
            key: 'puzzle-' + slot,
            draggable: isTarget && !solved,
            onDragStart: function (e) { onDragStart(e, slot); },
            onDragOver: function (e) { onDragOverSlot(e, slot); },
            onDrop: function (e) { onDrop(e, slot); },
            onDragEnd: onDragEnd,
            style: style,
        },
            React.createElement(BookDetails, { seed: slot + 50 }),
            isCorrect
                ? React.createElement(RevealedChar, { char: data.char })
                : React.createElement(SpineTitle, {
                    text: data.title,
                    author: data.author,
                    isCorrect: isCorrect,
                    target: isTarget && !solved,
                    glow: isTarget && !solved,
                }),
            // Pulsing glow border for target
            isTarget && !solved && React.createElement('div', {
                style: {
                    position: 'absolute', inset: '-2px',
                    border: '2px solid rgba(57,255,20,0.4)',
                    borderRadius: '3px 4px 4px 3px',
                    animation: 'bookGlow 1.5s ease-in-out infinite',
                    pointerEvents: 'none',
                }
            }),
            isCorrect && !solved && React.createElement('div', {
                style: {
                    position: 'absolute', top: '6px', right: '5px',
                    width: '3px', height: '3px', borderRadius: '50%',
                    background: '#39ff14', boxShadow: '0 0 6px rgba(57,255,20,0.6)',
                    zIndex: 2,
                }
            })
        );
    }

    // ══════════════════════════════════════════════════════════════
    // DECOY BOOK
    // ══════════════════════════════════════════════════════════════
    function renderDecoyBook(idx) {
        var data = DECOY_POOL[idx];
        if (!data) return null;
        var base = getSpineStyle(data.h, idx + 200);
        var style = Object.assign({}, base, {
            flex: '1 1 0',
            minWidth: '26px',
            cursor: 'default',
            border: '1px solid rgba(255,255,255,0.03)',
        });
        return React.createElement('div', { key: 'decoy-' + idx, style: style },
            React.createElement(BookDetails, { seed: idx + 200 }),
            React.createElement(SpineTitle, { text: data.title, author: data.author })
        );
    }

    // ── Slide direction ──
    function getSlideTransform(shelfIdx) {
        if (drawerPhase !== 'sliding' && drawerPhase !== 'revealed') return 'translateX(0)';
        return 'translateX(' + (shelfIdx % 2 === 0 ? '-120%' : '120%') + ')';
    }

    var correctCount = books.filter(function (b, i) { return b === CORRECT_ORDER[i]; }).length;

    // ══════════════════════════════════════════════════════════════
    // RENDER
    // ══════════════════════════════════════════════════════════════
    return React.createElement('div', {
        style: {
            width: '100%', fontFamily: "'Share Tech Mono', monospace",
            color: '#808080', position: 'relative', marginTop: '32px',
        },
    },
        // ── HEADER ──
        React.createElement('div', {
            style: {
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid rgba(57,255,20,0.12)',
                paddingBottom: '8px', marginBottom: '12px', fontSize: '13px',
            }
        },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', color: '#39ff14', fontWeight: 'bold' } },
                React.createElement('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: '#39ff14', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' } }),
                React.createElement('span', null, '// ARCHIVE_SHELF_SORT.EXE')
            ),
            React.createElement('span', { style: { fontSize: '10px', letterSpacing: '3px', color: solved ? '#39ff14' : '#2a2a2a' } },
                solved ? '■ UNLOCKED' : '□ LOCKED'
            )
        ),

        // ── INSTRUCTIONS & RULES ──
        React.createElement('div', { style: { fontSize: '10px', color: 'rgba(57,255,20,0.45)', marginBottom: '16px', lineHeight: '1.6', letterSpacing: '0.5px' } },
            React.createElement('div', null, solved ? '> SEQUENCE VERIFIED. EXTRACTING PAYLOAD...' : '> REARRANGE THE MARKED FRAGMENTS. THE GLOWING GLYPH IS YOUR NEXT TARGET.'),
            !solved && React.createElement('div', { style: { marginTop: '8px', opacity: 0.7, paddingLeft: '12px', borderLeft: '1px solid rgba(57,255,20,0.2)' } },
                React.createElement('div', null, '[1] ONLY THE GLOWING TARGET CAN BE EXTRACTED.'),
                React.createElement('div', null, '[2] DROP THE TARGET IN ITS DESIGNATED PROTOCOL SLOT.'),
                React.createElement('div', null, '[3] COMPLETE THE SEQUENCE TO REVEAL THE HIDDEN FREQUENCY.')
            )
        ),

        // ── CUPBOARD — with scanline overlay ──
        React.createElement('div', {
            style: {
                position: 'relative',
                background: 'linear-gradient(180deg, #050508 0%, #030306 50%, #020204 100%)',
                border: '1px solid rgba(255,255,255,0.04)', borderRadius: '2px',
                padding: '22px 16px 18px',
                boxShadow: 'inset 0 0 80px rgba(0,0,0,0.97), 0 12px 48px rgba(0,0,0,0.8)',
                overflow: 'hidden',
                minHeight: drawerPhase === 'revealed' ? '200px' : undefined,
            }
        },
            // ── SCANLINE OVERLAY — subtle CRT texture ──
            React.createElement('div', {
                style: {
                    position: 'absolute', inset: 0,
                    background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
                    pointerEvents: 'none', zIndex: 5,
                }
            }),
            // ── GRAIN TEXTURE ──
            React.createElement('div', {
                style: {
                    position: 'absolute', inset: 0,
                    background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 1px, rgba(255,255,255,0.003) 1px, rgba(255,255,255,0.003) 2px)',
                    pointerEvents: 'none', zIndex: 5,
                }
            }),
            // Frame accents
            React.createElement('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' } }),
            React.createElement('div', { style: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)' } }),

            // ── SHELVES ──
            STATIC_LAYOUT.map(function (items, shelfIdx) {
                return React.createElement('div', { key: shelfIdx, style: { marginBottom: '10px', position: 'relative', overflow: 'hidden' } },
                    // Rack label
                    React.createElement('div', {
                        style: {
                            fontSize: '7px', letterSpacing: '4px', color: 'rgba(255,255,255,0.05)',
                            marginBottom: '8px', fontFamily: "'Share Tech Mono', monospace",
                            transition: 'opacity 0.5s', opacity: drawerPhase === 'revealed' ? 0 : 1,
                        }
                    }, 'RACK_' + String(shelfIdx).padStart(2, '0')),

                    // Books row
                    React.createElement('div', {
                        style: {
                            display: 'flex', gap: '2px', alignItems: 'flex-end',
                            minHeight: '165px', padding: '0 6px 0 8px',
                            width: '100%', boxSizing: 'border-box',
                            transform: getSlideTransform(shelfIdx),
                            transition: drawerPhase === 'sliding' ? 'transform 1.4s cubic-bezier(0.65, 0, 0.35, 1)' : 'none',
                        }
                    }, items.map(function (item) {
                        if (item.type === 'puzzle') return renderPuzzleBook(item.slot);
                        return renderDecoyBook(item.idx);
                    })),

                    // ── SHELF PLANK — thick wood with grain ──
                    React.createElement('div', {
                        style: {
                            height: '24px',
                            background: 'linear-gradient(180deg, #4a2a18 0%, #3d2314 15%, #2c1810 80%, #1a0f0a 100%)',
                            borderTop: 'none',
                            marginTop: '-1px',
                            boxShadow: '0 15px 25px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1)',
                            borderRadius: '3px 3px 6px 6px',
                            position: 'relative',
                            transition: 'opacity 0.5s', opacity: drawerPhase === 'revealed' ? 0 : 1,
                        }
                    },
                        // Wood grain overlay
                        React.createElement('div', {
                            style: {
                                position: 'absolute', inset: 0,
                                background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 15px, rgba(0,0,0,0.1) 15px, rgba(0,0,0,0.1) 18px)',
                                opacity: 0.5,
                            }
                        })
                    )
                );
            }),

            // ── REVEAL ──
            showReveal && React.createElement('div', {
                style: {
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    animation: 'revealFadeIn 1s ease-out forwards', opacity: 0, zIndex: 10,
                    background: 'radial-gradient(ellipse at center, rgba(5,5,8,0.98) 0%, rgba(3,3,4,1) 100%)',
                }
            },
                React.createElement('div', { style: { position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(57,255,20,0.06) 0%, transparent 70%)', pointerEvents: 'none' } }),
                React.createElement('div', { style: { fontSize: '10px', letterSpacing: '8px', color: 'rgba(57,255,20,0.4)', marginBottom: '16px', fontWeight: 'bold' } }, 'SIGNAL_DECODED'),
                React.createElement('div', { style: { width: '60px', height: '1px', background: 'rgba(57,255,20,0.2)', marginBottom: '20px' } }),
                React.createElement('div', { style: { display: 'flex', gap: '4px', justifyContent: 'center' } },
                    HANDLE.split('').map(function (ch, i) {
                        return React.createElement('span', {
                            key: i, style: {
                                fontSize: '28px', fontWeight: 'bold', color: '#39ff14',
                                fontFamily: "'Share Tech Mono', monospace",
                                textShadow: '0 0 20px rgba(57,255,20,0.5), 0 0 40px rgba(57,255,20,0.2)',
                                animation: 'letterPop 0.4s ease-out ' + (0.6 + i * 0.08) + 's both',
                                opacity: 0,
                            }
                        }, ch);
                    })
                ),
                React.createElement('div', {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '20px',
                        animation: 'letterPop 0.4s ease-out 2s both',
                        opacity: 0,
                    }
                },
                    React.createElement('div', { style: { fontSize: '8px', color: 'rgba(57,255,20,0.25)', letterSpacing: '4px' } }, '// FOLLOW THE SIGNAL'),
                    React.createElement('svg', {
                        xmlns: 'http://www.w3.org/2000/svg',
                        viewBox: '0 0 448 512',
                        width: '14', height: '14',
                        style: {
                            fill: 'rgba(57,255,20,0.35)',
                            filter: 'drop-shadow(0 0 4px rgba(57,255,20,0.2))',
                        },
                    },
                        React.createElement('path', { d: 'M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z' })
                    )
                )
            )
        ),

        // ── PROGRESS BAR ──
        !showReveal && React.createElement('div', { style: { marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' } },
            React.createElement('div', { style: { fontSize: '8px', letterSpacing: '2px', color: '#2a2a2a', whiteSpace: 'nowrap' } },
                'INTEGRITY: ' + correctCount + '/' + CORRECT_ORDER.length
            ),
            React.createElement('div', { style: { flex: 1, height: '3px', background: '#0a0a0a', border: '1px solid #111', borderRadius: '1px', overflow: 'hidden' } },
                React.createElement('div', {
                    style: {
                        height: '100%', background: 'linear-gradient(90deg, #39ff14, #22c55e)',
                        transition: 'width 0.4s ease', borderRadius: '1px',
                        width: ((correctCount / CORRECT_ORDER.length) * 100) + '%',
                        boxShadow: '0 0 6px rgba(57,255,20,0.3)',
                    }
                })
            )
        ),

        // ── RESET ──
        !solved && React.createElement('button', {
            onClick: handleReset,
            style: {
                marginTop: '10px', background: 'transparent',
                border: '1px solid #111', color: '#1e1e1e',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '9px', letterSpacing: '3px',
                padding: '5px 14px', cursor: 'pointer',
                transition: 'all 0.2s', textTransform: 'uppercase',
            },
            onMouseEnter: function (e) { e.currentTarget.style.borderColor = '#39ff14'; e.currentTarget.style.color = '#39ff14'; },
            onMouseLeave: function (e) { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.color = '#1e1e1e'; },
        }, '↻ RESHUFFLE')
    );
}
