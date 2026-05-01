import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import AddVariantModal from '../components/AddVariantModal';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct]               = useState(null);
    const [selectedColorIdx, setSelectedColorIdx] = useState(null); // index into product.variant[]
    const [selectedSize, setSelectedSize]     = useState(null);
    const [selectedImage, setSelectedImage]   = useState(0);
    const [showVariantModal, setShowVariantModal] = useState(false);

    const { handleGetProductById } = useProduct();
    const currentUser = useSelector(state => state.auth.user);

    const isOwnerSeller = useMemo(() => {
        if (currentUser?.role !== 'seller') return false;
        if (!product?.seller) return false;
        const sellerId = String(product.seller?._id ?? product.seller);
        const userId   = String(currentUser.id ?? currentUser._id ?? '');
        return !!userId && sellerId === userId;
    }, [currentUser, product]);

    /* ── fetch ── */
    useEffect(() => {
        if (id) {
            handleGetProductById(id)
                .then(data => setProduct(data))
                .catch(err => console.error('Failed to fetch product', err));
        }
    }, [id]);

    /* ── derived ── */
    const hasVariants = product?.variant?.length > 0;

    // The active color variant object
    const activeVariant = useMemo(
        () => (selectedColorIdx !== null ? product?.variant?.[selectedColorIdx] : null),
        [product, selectedColorIdx]
    );

    // Images shown in the gallery
    const displayImages = useMemo(() => {
        if (activeVariant?.images?.length > 0) return activeVariant.images;
        if (product?.images?.length > 0) return product.images;
        return [{ url: '/snitch_editorial_warm.png' }];
    }, [activeVariant, product]);

    // Sizes available for the active color
    const activeSizes = useMemo(
        () => activeVariant?.sizes ?? [],
        [activeVariant]
    );

    // The selected size entry
    const activeSizeEntry = useMemo(
        () => activeSizes.find(s => s.size === selectedSize) ?? null,
        [activeSizes, selectedSize]
    );

    // Price: prefer selected size price, then base product price
    const displayPrice = activeSizeEntry?.price ?? activeVariant?.sizes?.[0]?.price ?? product?.price;

    // Stock
    const displayStock = activeSizeEntry?.stock ?? null;

    /* ── reset image when color changes ── */
    useEffect(() => { setSelectedImage(0); setSelectedSize(null); }, [selectedColorIdx]);

    /* ── loading ── */
    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fbf9f6' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", color: '#B5ADA3' }}
                    className="text-[10px] uppercase tracking-[0.2em] font-medium animate-pulse">
                    Retrieving piece...
                </p>
            </div>
        );
    }

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30 pb-24"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >
                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-12 lg:pt-20">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">

                        {/* ── LEFT: Image Gallery ── */}
                        <div className="w-full lg:w-[70%] flex flex-col-reverse md:flex-row gap-4 lg:gap-6">

                            {/* Thumbnails */}
                            {displayImages.length > 1 && (
                                <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 w-full md:w-20 lg:w-24 flex-shrink-0 md:max-h-[calc(100vh-200px)]">
                                    {displayImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`flex-shrink-0 w-20 md:w-full aspect-[4/5] overflow-hidden transition-all duration-300 ${selectedImage === idx ? 'opacity-100 ring-1 ring-[#C9A96E] ring-offset-2' : 'opacity-50 hover:opacity-100'}`}
                                            style={{ backgroundColor: '#f5f3f0', '--tw-ring-offset-color': '#fbf9f6' }}
                                        >
                                            <img src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main image */}
                            <div className="relative w-full aspect-[4/5] overflow-hidden group" style={{ backgroundColor: '#f5f3f0' }}>
                                <img
                                    src={displayImages[selectedImage]?.url || displayImages[0]?.url}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                />
                                {displayImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setSelectedImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}
                                            className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border"
                                            style={{ backgroundColor: 'rgba(251,249,246,0.8)', borderColor: '#e4e2df', color: '#1b1c1a' }}
                                            aria-label="Previous image"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15 19l-7-7 7-7" /></svg>
                                        </button>
                                        <button
                                            onClick={() => setSelectedImage(prev => prev === displayImages.length - 1 ? 0 : prev + 1)}
                                            className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border"
                                            style={{ backgroundColor: 'rgba(251,249,246,0.8)', borderColor: '#e4e2df', color: '#1b1c1a' }}
                                            aria-label="Next image"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* ── RIGHT: Product Details ── */}
                        <div className="w-full lg:w-[30%] lg:sticky lg:top-24 flex flex-col pt-4">

                            <h1
                                className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] mb-6"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                            >
                                {product.title}
                            </h1>

                            <div className="mb-8">
                                <span className="text-sm uppercase tracking-[0.2em] font-medium" style={{ color: '#1b1c1a' }}>
                                    {displayPrice?.currency} {displayPrice?.amount?.toLocaleString()}
                                </span>
                            </div>

                            <div className="h-px w-full mb-8" style={{ backgroundColor: '#e4e2df' }} />

                            {/* ── Colour Swatches ── */}
                            {(hasVariants || product?.color) && (
                                <div className="mb-8">
                                    <h3 className="text-[10px] uppercase tracking-[0.24em] font-medium mb-3" style={{ color: '#C9A96E' }}>
                                        Colour
                                        <span style={{ color: '#1b1c1a', marginLeft: '8px', textTransform: 'none', letterSpacing: 0, fontSize: '11px' }}>
                                            — {activeVariant ? activeVariant.color : (product?.color || 'Original')}
                                        </span>
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {/* Base product colour swatch */}
                                        {(() => {
                                            const isBase = selectedColorIdx === null;
                                            // Simple name→hex map; falls back to a neutral tone
                                            const BASE_COLORS = {
                                                black: '#1b1c1a', white: '#f5f3f0', red: '#c0392b',
                                                blue: '#2c3e8c', navy: '#1a2350', green: '#2e7d52',
                                                olive: '#6b6e3a', grey: '#888888', gray: '#888888',
                                                brown: '#7a5230', beige: '#d4b896', cream: '#e8dcc8',
                                                yellow: '#d4a017', orange: '#c0612b', pink: '#c06080',
                                                purple: '#6a3080', maroon: '#7a1c2a', khaki: '#9b8b5a',
                                                original: '#1b1c1a'
                                            };
                                            const baseColorName = product?.color || 'Original';
                                            const key = baseColorName.toLowerCase().split(' ').find(w => BASE_COLORS[w]) || baseColorName.toLowerCase();
                                            const hex = BASE_COLORS[key] || '#888888';
                                            return (
                                                <button
                                                    key="base"
                                                    onClick={() => setSelectedColorIdx(null)}
                                                    title={baseColorName}
                                                    className="relative flex-shrink-0 transition-transform duration-200 hover:scale-110"
                                                    style={{
                                                        width: 28, height: 28, borderRadius: '50%',
                                                        backgroundColor: hex,
                                                        boxShadow: isBase
                                                            ? `0 0 0 2px #fbf9f6, 0 0 0 3.5px ${hex}`
                                                            : '0 0 0 1px rgba(0,0,0,0.12)',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                    }}
                                                    aria-label={baseColorName}
                                                    aria-pressed={isBase}
                                                />
                                            );
                                        })()}

                                        {/* Colour variant swatches */}
                                        {product.variant?.map((v, idx) => {
                                            const isActive = selectedColorIdx === idx;
                                            return (
                                                <button
                                                    key={v._id || idx}
                                                    onClick={() => setSelectedColorIdx(isActive ? null : idx)}
                                                    title={v.color}
                                                    className="relative flex-shrink-0 transition-transform duration-200 hover:scale-110"
                                                    style={{
                                                        width: 28, height: 28, borderRadius: '50%',
                                                        backgroundColor: v.colorHex || '#888888',
                                                        boxShadow: isActive
                                                            ? `0 0 0 2px #fbf9f6, 0 0 0 3.5px ${v.colorHex || '#888888'}`
                                                            : '0 0 0 1px rgba(0,0,0,0.12)',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                    }}
                                                    aria-label={v.color}
                                                    aria-pressed={isActive}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ── Size Selector ── */}
                            {activeVariant && activeSizes.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-[10px] uppercase tracking-[0.24em] font-medium mb-3" style={{ color: '#C9A96E' }}>
                                        Size
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {activeSizes.map(s => {
                                            const isSelected = selectedSize === s.size;
                                            const outOfStock = s.stock === 0;
                                            return (
                                                <button
                                                    key={s.size}
                                                    onClick={() => !outOfStock && setSelectedSize(isSelected ? null : s.size)}
                                                    disabled={outOfStock}
                                                    className={`px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-200 border relative ${
                                                        isSelected
                                                            ? 'border-[#1b1c1a] bg-[#1b1c1a] text-[#fbf9f6]'
                                                            : outOfStock
                                                                ? 'border-[#e4e2df] text-[#B5ADA3] cursor-not-allowed'
                                                                : 'border-[#d0c5b5] text-[#1b1c1a] hover:border-[#1b1c1a]'
                                                    }`}
                                                    style={isSelected ? {} : { backgroundColor: 'transparent' }}
                                                >
                                                    {s.size}
                                                    {outOfStock && (
                                                        <span
                                                            className="absolute inset-0 flex items-center justify-center"
                                                            style={{ pointerEvents: 'none' }}
                                                        >
                                                            <span style={{
                                                                position: 'absolute', width: '70%',
                                                                height: '1px', backgroundColor: '#B5ADA3',
                                                                transform: 'rotate(-20deg)',
                                                            }} />
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ── Stock badge ── */}
                            {displayStock !== null && (
                                <div className="mb-6">
                                    <span className={`text-[10px] uppercase tracking-[0.2em] font-medium ${displayStock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                        {displayStock > 0 ? `${displayStock} in stock` : 'Out of stock'}
                                    </span>
                                </div>
                            )}

                            {/* ── Description ── */}
                            <div className="mb-12">
                                <h3 className="text-[10px] uppercase tracking-[0.24em] font-medium mb-4" style={{ color: '#C9A96E' }}>
                                    The Details
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#7A6E63' }}>
                                    {product.description}
                                </p>
                            </div>

                            {/* ── Actions ── */}
                            <div className="flex flex-col gap-4 mt-auto">

                                {/* Add Variant — owning seller only */}
                                {isOwnerSeller && (
                                    <button
                                        id="add-variant-btn"
                                        onClick={() => setShowVariantModal(true)}
                                        className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 border"
                                        style={{ backgroundColor: 'transparent', borderColor: '#C9A96E', color: '#C9A96E', fontFamily: "'Inter', sans-serif" }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C9A96E'; e.currentTarget.style.color = '#1b1c1a'; }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#C9A96E'; }}
                                    >
                                        + Add Colour Variant
                                    </button>
                                )}

                                {/* Buyer actions */}
                                {!isOwnerSeller && (
                                    <>
                                        <button
                                            className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                                            style={{ backgroundColor: '#1b1c1a', color: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
                                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C9A96E'; e.currentTarget.style.color = '#1b1c1a'; }}
                                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1b1c1a'; e.currentTarget.style.color = '#fbf9f6'; }}
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 border"
                                            style={{ backgroundColor: 'transparent', borderColor: '#d0c5b5', color: '#1b1c1a', fontFamily: "'Inter', sans-serif" }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A96E'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#d0c5b5'; }}
                                        >
                                            Buy Now
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* ── Policies ── */}
                            <div className="mt-14 space-y-4 text-[10px] uppercase tracking-[0.1em]" style={{ color: '#B5ADA3' }}>
                                <div className="flex justify-between border-b pb-3" style={{ borderColor: '#e4e2df' }}>
                                    <span>Shipping</span><span>Complimentary over INR 15,000</span>
                                </div>
                                <div className="flex justify-between border-b pb-3" style={{ borderColor: '#e4e2df' }}>
                                    <span>Returns</span><span>Within 14 days of delivery</span>
                                </div>
                                <div className="flex justify-between border-b pb-3" style={{ borderColor: '#e4e2df' }}>
                                    <span>Authenticity</span><span>100% Guaranteed</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Add Colour Variant Modal */}
            {showVariantModal && (
                <AddVariantModal
                    productId={product._id}
                    onClose={() => setShowVariantModal(false)}
                    onSuccess={(updatedProduct) => {
                        setProduct(updatedProduct);
                        setShowVariantModal(false);
                    }}
                />
            )}
        </>
    );
};

export default ProductDetail;