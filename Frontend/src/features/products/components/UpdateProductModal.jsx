import React, { useState, useEffect } from 'react';
import { useProduct } from '../hook/useProduct';

/**
 * UpdateProductModal
 *
 * Seller updates basic product info:
 *   • Title
 *   • Description
 *   • Price (Amount + Currency)
 *   • Base Colour
 *
 * Props:
 *   product   – current product object
 *   onClose   – () => void
 *   onSuccess – (updatedProduct) => void
 */

/* ─── palette ─── */
const gold        = '#C9A96E';
const dark        = '#1b1c1a';
const cream       = '#fbf9f6';
const muted       = '#7A6E63';
const border      = '#e4e2df';
const red         = '#b94040';
const lightMuted  = '#B5ADA3';

const CURRENCIES = ['INR', 'USD'];

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

const UnderlineTextArea = ({ style = {}, ...props }) => (
    <textarea
        className="bg-transparent outline-none text-sm py-2 transition-colors duration-200 border-b w-full min-h-[100px] resize-none"
        style={{ borderColor: border, color: dark, ...style }}
        onFocus={e => (e.target.style.borderColor = gold)}
        onBlur={e => (e.target.style.borderColor = border)}
        {...props}
    />
);

const UpdateProductModal = ({ product, onClose, onSuccess }) => {
    const { handleUpdateProduct } = useProduct();

    const [title, setTitle] = useState(product.title || '');
    const [description, setDescription] = useState(product.description || '');
    const [priceAmount, setPriceAmount] = useState(product.price?.amount || '');
    const [priceCurrency, setPriceCurrency] = useState(product.price?.currency || 'INR');
    const [color, setColor] = useState(product.color || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) { setError('Title is required.'); return; }
        if (!priceAmount || isNaN(Number(priceAmount))) { setError('Valid price is required.'); return; }

        const updateData = {
            title: title.trim(),
            description: description.trim(),
            priceAmount: Number(priceAmount),
            priceCurrency,
            color: color.trim(),
        };

        try {
            setLoading(true);
            const res = await handleUpdateProduct(product._id, updateData);
            onSuccess(res.product);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to update product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 z-50"
                style={{ backgroundColor: 'rgba(27,28,26,0.55)', backdropFilter: 'blur(4px)' }}
                onClick={onClose}
            />

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
                    <button
                        type="button" onClick={onClose}
                        className="absolute top-5 right-5 text-xl leading-none transition-colors duration-200"
                        style={{ color: lightMuted }}
                        onMouseEnter={e => (e.currentTarget.style.color = gold)}
                        onMouseLeave={e => (e.currentTarget.style.color = lightMuted)}
                        aria-label="Close"
                    >✕</button>

                    <div>
                        <span className="text-[10px] uppercase tracking-[0.35em] font-medium"
                            style={{ color: gold, fontFamily: "'Cormorant Garamond', serif" }}>
                            Seller Panel
                        </span>
                        <h2 className="text-3xl font-light leading-tight mt-1"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: dark }}>
                            Update Product Details
                        </h2>
                        <div className="mt-3 w-10 h-px" style={{ backgroundColor: gold }} />
                    </div>

                    {error && (
                        <p className="text-[11px] uppercase tracking-[0.15em]" style={{ color: red }}>{error}</p>
                    )}

                    <div className="flex flex-col gap-3">
                        <Label>Title</Label>
                        <UnderlineInput
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Product Title"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label>Description</Label>
                        <UnderlineTextArea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Product Description"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label>Price</Label>
                        <div className="flex gap-4">
                            <div className="w-24">
                                <select
                                    value={priceCurrency}
                                    onChange={e => setPriceCurrency(e.target.value)}
                                    className="border-b bg-transparent outline-none text-sm py-2 w-full cursor-pointer transition-colors duration-200"
                                    style={{ borderColor: border, color: dark }}
                                >
                                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="flex-1">
                                <UnderlineInput
                                    type="number"
                                    value={priceAmount}
                                    onChange={e => setPriceAmount(e.target.value)}
                                    placeholder="Amount"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label>Base Colour</Label>
                        <UnderlineInput
                            type="text"
                            value={color}
                            onChange={e => setColor(e.target.value)}
                            placeholder="Base Colour (e.g. White)"
                        />
                    </div>

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
                        {loading ? 'Updating...' : 'Update Product'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default UpdateProductModal;
