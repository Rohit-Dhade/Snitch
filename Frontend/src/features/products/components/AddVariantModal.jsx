import React, { useState, useRef, useCallback } from 'react';
import { useProduct } from '../hook/useProduct';

/**
 * AddVariantModal – Color + Sizes
 *
 * Seller fills in:
 *   • Color name  (e.g. "Black")
 *   • Color hex   (colour picker, optional)
 *   • Sizes table – XS/S/M/L/XL/XXL, each row has stock + price
 *   • Photos      – per-colour images (drag/drop or click)
 *
 * Props:
 *   productId – string
 *   onClose   – () => void
 *   onSuccess – (updatedProduct) => void
 */

/* ─── palette ─── */
const gold        = '#C9A96E';
const dark        = '#1b1c1a';
const cream       = '#fbf9f6';
const muted       = '#7A6E63';
const border      = '#e4e2df';
const chipBg      = '#f0ede8';
const red         = '#b94040';
const lightMuted  = '#B5ADA3';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CURRENCIES = ['INR', 'USD'];

/* ─── shared tiny components ─── */
const Label = ({ children }) => (
    <span className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: muted }}>
        {children}
    </span>
);

const UnderlineInput = ({ style = {}, ...props }) => (
    <input
        className="bg-transparent outline-none text-sm py-2 transition-colors duration-200 border-b w-full"
        style={{ borderColor: border, color: dark, ...style }}
        onFocus={e => (e.target.style.borderColor = gold)}
        onBlur={e => (e.target.style.borderColor = border)}
        {...props}
    />
);

/* ─── Size row ─── */
const SizeRow = ({ size, entry, onChange }) => {
    const enabled = !!entry;
    const toggle = () =>
        onChange(size, enabled ? null : { stock: '', priceAmount: '' });

    return (
        <div
            className="flex items-center gap-3 py-2 px-3 transition-colors duration-200"
            style={{
                backgroundColor: enabled ? 'rgba(201,169,110,0.07)' : 'transparent',
                border: `1px solid ${enabled ? gold : border}`,
            }}
        >
            {/* Enable checkbox / size label */}
            <button
                type="button"
                onClick={toggle}
                className="flex items-center gap-2 flex-shrink-0"
                style={{ color: enabled ? dark : lightMuted }}
            >
                <div style={{
                    width: 14, height: 14, border: `1.5px solid ${enabled ? gold : lightMuted}`,
                    backgroundColor: enabled ? gold : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.2s',
                }}>
                    {enabled && (
                        <svg viewBox="0 0 10 8" width="8" height="8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke={dark} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </div>
                <span className="text-[11px] uppercase tracking-[0.15em] font-medium w-8 text-left">
                    {size}
                </span>
            </button>

            {/* Stock & price — only when enabled */}
            {enabled && (
                <>
                    <div className="flex-1">
                        <input
                            type="number"
                            min="0"
                            value={entry.stock}
                            onChange={e => onChange(size, { ...entry, stock: e.target.value })}
                            placeholder="Stock"
                            className="w-full bg-transparent outline-none text-[12px] border-b py-1 transition-colors duration-200"
                            style={{ borderColor: border, color: dark }}
                            onFocus={e => (e.target.style.borderColor = gold)}
                            onBlur={e => (e.target.style.borderColor = border)}
                        />
                    </div>
                    <div className="flex-1">
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={entry.priceAmount}
                            onChange={e => onChange(size, { ...entry, priceAmount: e.target.value })}
                            placeholder="Price"
                            className="w-full bg-transparent outline-none text-[12px] border-b py-1 transition-colors duration-200"
                            style={{ borderColor: border, color: dark }}
                            onFocus={e => (e.target.style.borderColor = gold)}
                            onBlur={e => (e.target.style.borderColor = border)}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

/* ─── Main modal ─── */
const AddVariantModal = ({ productId, onClose, onSuccess }) => {
    const { handleAddVariant } = useProduct();

    const [color, setColor]               = useState('');
    const [colorHex, setColorHex]         = useState('#888888');
    const [priceCurrency, setPriceCurrency] = useState('INR');
    // sizes: { S: null | { stock, priceAmount }, M: ..., ... }
    const [sizes, setSizes]               = useState({});
    const [images, setImages]             = useState([]);
    const [previews, setPreviews]         = useState([]);
    const [isDragging, setIsDragging]     = useState(false);
    const [loading, setLoading]           = useState(false);
    const [error, setError]               = useState('');
    const fileRef = useRef();

    /* ── size helpers ── */
    const handleSizeChange = useCallback((size, val) => {
        setSizes(prev => {
            const next = { ...prev };
            if (val === null) delete next[size];
            else next[size] = val;
            return next;
        });
    }, []);

    /* ── image helpers ── */
    const addFiles = (files) => {
        const toAdd = Array.from(files).slice(0, 7 - images.length);
        setImages(prev => [...prev, ...toAdd]);
        setPreviews(prev => [...prev, ...toAdd.map(f => URL.createObjectURL(f))]);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    }, [images]);

    const removeImage = (idx) => {
        URL.revokeObjectURL(previews[idx]);
        setImages(prev => prev.filter((_, i) => i !== idx));
        setPreviews(prev => prev.filter((_, i) => i !== idx));
    };

    /* ── submit ── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!color.trim()) { setError('Color name is required.'); return; }

        const activeSizes = Object.entries(sizes).filter(([, v]) => v !== null);
        if (activeSizes.length === 0) { setError('Enable at least one size.'); return; }

        for (const [sz, v] of activeSizes) {
            if (!v.priceAmount || isNaN(Number(v.priceAmount))) {
                setError(`Enter a valid price for size ${sz}.`); return;
            }
            if (v.stock === '' || isNaN(Number(v.stock))) {
                setError(`Enter a valid stock for size ${sz}.`); return;
            }
        }

        const sizesPayload = activeSizes.map(([sz, v]) => ({
            size: sz,
            stock: v.stock,
            priceAmount: v.priceAmount,
        }));

        const formData = new FormData();
        formData.append('productId', productId);
        formData.append('color', color.trim());
        formData.append('colorHex', colorHex);
        formData.append('priceCurrency', priceCurrency);
        formData.append('sizes', JSON.stringify(sizesPayload));
        images.forEach(img => formData.append('images', img));

        try {
            setLoading(true);
            const res = await handleAddVariant(productId, formData);
            onSuccess(res.product);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to add variant. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50"
                style={{ backgroundColor: 'rgba(27,28,26,0.55)', backdropFilter: 'blur(4px)' }}
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
                <form
                    onSubmit={handleSubmit}
                    onClick={e => e.stopPropagation()}
                    className="relative w-full max-w-lg flex flex-col gap-6 overflow-y-auto"
                    style={{
                        backgroundColor: cream,
                        padding: '2.5rem',
                        maxHeight: '92vh',
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    {/* Close */}
                    <button
                        type="button" onClick={onClose}
                        className="absolute top-5 right-5 text-xl leading-none transition-colors duration-200"
                        style={{ color: lightMuted }}
                        onMouseEnter={e => (e.currentTarget.style.color = gold)}
                        onMouseLeave={e => (e.currentTarget.style.color = lightMuted)}
                        aria-label="Close"
                    >✕</button>

                    {/* Header */}
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.35em] font-medium"
                            style={{ color: gold, fontFamily: "'Cormorant Garamond', serif" }}>
                            Seller Panel
                        </span>
                        <h2 className="text-3xl font-light leading-tight mt-1"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: dark }}>
                            Add Colour Variant
                        </h2>
                        <div className="mt-3 w-10 h-px" style={{ backgroundColor: gold }} />
                    </div>

                    {error && (
                        <p className="text-[11px] uppercase tracking-[0.15em]" style={{ color: red }}>{error}</p>
                    )}

                    {/* ── Colour ── */}
                    <div className="flex flex-col gap-3">
                        <Label>Colour</Label>
                        <div className="flex items-end gap-4">
                            {/* Colour swatch picker */}
                            <div className="relative flex-shrink-0">
                                <div
                                    className="w-10 h-10 border cursor-pointer"
                                    style={{ backgroundColor: colorHex, borderColor: border }}
                                    title="Pick colour"
                                />
                                <input
                                    type="color"
                                    value={colorHex}
                                    onChange={e => setColorHex(e.target.value)}
                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                    title="Pick colour"
                                />
                            </div>
                            <div className="flex-1">
                                <UnderlineInput
                                    type="text"
                                    value={color}
                                    onChange={e => setColor(e.target.value)}
                                    placeholder="Colour name  (e.g. Midnight Black)"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Currency ── */}
                    <div className="flex flex-col gap-1">
                        <Label>Currency</Label>
                        <select
                            value={priceCurrency}
                            onChange={e => setPriceCurrency(e.target.value)}
                            className="border-b bg-transparent outline-none text-sm py-2 cursor-pointer transition-colors duration-200"
                            style={{ borderColor: border, color: dark }}
                        >
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* ── Sizes ── */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <Label>Sizes  <span style={{ color: lightMuted, textTransform: 'none', letterSpacing: 0 }}>— toggle to enable</span></Label>
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                            {/* Column labels */}
                            <div className="flex items-center gap-3 px-3 pb-1"
                                style={{ color: lightMuted, fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                                <span className="w-[calc(14px+8px+2rem)]">Size</span>
                                <span className="flex-1">Stock (units)</span>
                                <span className="flex-1">Price</span>
                            </div>
                            {SIZES.map(sz => (
                                <SizeRow
                                    key={sz}
                                    size={sz}
                                    entry={sizes[sz] ?? null}
                                    onChange={handleSizeChange}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ── Images ── */}
                    <div className="flex flex-col gap-3">
                        <Label>
                            Photos for this colour
                            <span style={{ color: lightMuted, textTransform: 'none', letterSpacing: 0 }}> (max 7)</span>
                        </Label>

                        {/* Drop zone */}
                        {images.length < 7 && (
                            <div
                                onDrop={handleDrop}
                                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onClick={() => fileRef.current?.click()}
                                className="border border-dashed py-8 flex flex-col items-center gap-2 cursor-pointer transition-all duration-300"
                                style={{
                                    borderColor: isDragging ? gold : border,
                                    backgroundColor: isDragging ? 'rgba(201,169,110,0.05)' : 'transparent',
                                }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke={isDragging ? gold : lightMuted} strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                <p className="text-[11px] uppercase tracking-[0.15em]" style={{ color: isDragging ? gold : lightMuted }}>
                                    Drop or click to upload
                                </p>
                                <input
                                    ref={fileRef} type="file" accept="image/*" multiple
                                    onChange={e => { addFiles(e.target.files); e.target.value = ''; }}
                                    className="hidden"
                                />
                            </div>
                        )}

                        {previews.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                {previews.map((src, i) => (
                                    <div key={i} className="relative aspect-square overflow-hidden group" style={{ backgroundColor: '#f5f3f0' }}>
                                        <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[10px] uppercase tracking-widest"
                                            style={{ backgroundColor: 'rgba(27,28,26,0.7)', color: cream }}
                                        >Remove</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Submit ── */}
                    <button
                        type="submit" disabled={loading}
                        className="w-full py-4 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300"
                        style={{
                            backgroundColor: loading ? lightMuted : dark,
                            color: cream,
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                        onMouseEnter={e => { if (!loading) { e.currentTarget.style.backgroundColor = gold; e.currentTarget.style.color = dark; } }}
                        onMouseLeave={e => { if (!loading) { e.currentTarget.style.backgroundColor = dark; e.currentTarget.style.color = cream; } }}
                    >
                        {loading ? 'Adding...' : 'Add Colour Variant'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default AddVariantModal;
