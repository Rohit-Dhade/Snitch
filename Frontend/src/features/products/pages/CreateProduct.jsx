import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from '../hook/useProduct.js';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];
const MAX_IMAGES = 7;

const CreateProduct = () => {
    const { handleCreateProduct } = useProduct();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR',
    });
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addFiles = (files) => {
        const remaining = MAX_IMAGES - images.length;
        if (remaining <= 0) return;
        const toAdd = Array.from(files).slice(0, remaining);
        const newImages = toAdd.map(file => ({ file, preview: URL.createObjectURL(file) }));
        setImages(prev => [...prev, ...newImages]);
    };

    const handleFileChange = (e) => {
        addFiles(e.target.files);
        e.target.value = '';
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    }, [images]);

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);

    const removeImage = (index) => {
        setImages(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('priceAmount', formData.priceAmount);
            data.append('priceCurrency', formData.priceCurrency);
            images.forEach(img => data.append('images', img.file));
            await handleCreateProduct(data);
            navigate('/');
        } catch (err) {
            console.error('Failed to create product', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full bg-transparent outline-none py-4 text-sm transition-colors duration-300 placeholder:text-[#555048]";
    const inputStyle = { color: '#e8e2d9', borderBottom: '1px solid #38332c', fontFamily: "'Inter', sans-serif" };
    const handleFocus = (e) => { e.target.style.borderBottomColor = '#b8955a'; };
    const handleBlur = (e) => { e.target.style.borderBottomColor = '#38332c'; };

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
            {/* Hide scrollbar globally for this page */}
            <style>{`
                html, body { scrollbar-width: none; -ms-overflow-style: none; }
                html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
            `}</style>

            <div
                className="min-h-screen selection:bg-[#b8955a]/25"
                style={{ backgroundColor: '#1a1a1a', fontFamily: "'Inter', sans-serif" }}
            >
                <div className="max-w-6xl mx-auto px-8 lg:px-16 xl:px-24">

                    {/* ── Top Bar ── */}
                    <div className="pt-10 pb-0 flex items-center gap-5">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-lg transition-colors duration-200 leading-none"
                            style={{ color: '#5a5248' }}
                            aria-label="Go back"
                            onMouseEnter={e => e.currentTarget.style.color = '#b8955a'}
                            onMouseLeave={e => e.currentTarget.style.color = '#5a5248'}
                        >
                            ←
                        </button>
                        <span
                            className="text-xs font-medium tracking-[0.32em] uppercase"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#b8955a' }}
                        >
                            Snitch.
                        </span>
                    </div>

                    {/* ── Page Header ── */}
                    <div className="pt-10 pb-0">
                        <h1
                            className="text-4xl lg:text-5xl font-light leading-tight"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#e8e2d9' }}
                        >
                            New Listing
                        </h1>
                        {/* Gold rule separator */}
                        <div className="mt-4 w-14 h-px" style={{ backgroundColor: '#b8955a' }} />
                    </div>

                    {/* ── Form ── */}
                    <form onSubmit={handleSubmit} className="pt-14 pb-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 lg:items-start">

                            {/* ── LEFT COLUMN: Text Fields ── */}
                            <div className="flex flex-col gap-12">

                                {/* Product Title */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="cp-title"
                                        className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                        style={{ color: '#6b6056' }}
                                    >
                                        Product Title
                                    </label>
                                    <input
                                        id="cp-title"
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Oversized Linen Shirt"
                                        className={inputClass}
                                        style={inputStyle}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="cp-description"
                                        className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                        style={{ color: '#6b6056' }}
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="cp-description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={5}
                                        placeholder="Describe the product — material, fit, details..."
                                        className="w-full bg-transparent outline-none py-4 text-sm transition-colors duration-300 resize-none leading-relaxed placeholder:text-[#555048]"
                                        style={inputStyle}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                </div>

                                {/* Price */}
                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#6b6056' }}>
                                        Price
                                    </label>
                                    <div className="flex gap-5 items-end">
                                        {/* Amount */}
                                        <div className="flex flex-col gap-1 flex-[3]">
                                            <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: '#4a453f' }}>Amount</span>
                                            <input
                                                id="cp-priceAmount"
                                                type="number"
                                                name="priceAmount"
                                                value={formData.priceAmount}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                className={inputClass}
                                                style={inputStyle}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                            />
                                        </div>
                                        {/* Currency */}
                                        <div className="flex flex-col gap-1 flex-[1]">
                                            <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: '#4a453f' }}>Currency</span>
                                            <select
                                                id="cp-priceCurrency"
                                                name="priceCurrency"
                                                value={formData.priceCurrency}
                                                onChange={handleChange}
                                                className="w-full bg-transparent outline-none py-4 text-sm cursor-pointer appearance-none transition-colors duration-300"
                                                style={inputStyle}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                            >
                                                {CURRENCIES.map(c => (
                                                    <option key={c} value={c} style={{ backgroundColor: '#252420', color: '#e8e2d9' }}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── RIGHT COLUMN: Images ── */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#6b6056' }}>
                                        Images
                                    </label>
                                    <span className="text-[10px]" style={{ color: '#4a453f' }}>
                                        {images.length}/{MAX_IMAGES}
                                    </span>
                                </div>

                                {/* Drop Zone */}
                                {images.length < MAX_IMAGES && (
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border border-dashed px-8 py-14 lg:py-20 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300"
                                        style={{
                                            borderColor: isDragging ? '#b8955a' : '#2e2922',
                                            backgroundColor: isDragging ? 'rgba(184,149,90,0.06)' : 'rgba(255,255,255,0.01)'
                                        }}
                                    >
                                        {/* Upload icon */}
                                        <div
                                            className="w-10 h-10 flex items-center justify-center border transition-colors duration-300"
                                            style={{ borderColor: isDragging ? '#b8955a' : '#2e2922', color: isDragging ? '#b8955a' : '#4a453f' }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm leading-relaxed" style={{ color: '#5a5248' }}>
                                                Drop images here or{' '}
                                                <span style={{ color: '#b8955a', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                                                    tap to upload
                                                </span>
                                            </p>
                                            <p className="text-[10px] uppercase tracking-[0.15em] mt-2" style={{ color: '#4a453f' }}>
                                                Up to {MAX_IMAGES} images
                                            </p>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                )}

                                {/* Image Previews */}
                                {images.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-1">
                                        {images.map((img, index) => (
                                            <div
                                                key={index}
                                                className="relative aspect-square overflow-hidden group"
                                                style={{ backgroundColor: '#252420' }}
                                            >
                                                <img
                                                    src={img.preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Remove overlay */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium tracking-widest uppercase"
                                                    style={{ backgroundColor: 'rgba(10,9,8,0.72)', color: '#e8e2d9' }}
                                                    aria-label={`Remove image ${index + 1}`}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Submit Button ── */}
                        <div className="mt-16 lg:mt-20">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    backgroundColor: isSubmitting ? '#2e2922' : '#252420',
                                    color: '#e8e2d9',
                                    fontFamily: "'Inter', sans-serif",
                                    border: '1px solid #38332c'
                                }}
                                onMouseEnter={e => {
                                    if (!isSubmitting) {
                                        e.currentTarget.style.backgroundColor = '#b8955a';
                                        e.currentTarget.style.color = '#1a1a1a';
                                        e.currentTarget.style.borderColor = '#b8955a';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isSubmitting) {
                                        e.currentTarget.style.backgroundColor = '#252420';
                                        e.currentTarget.style.color = '#e8e2d9';
                                        e.currentTarget.style.borderColor = '#38332c';
                                    }
                                }}
                            >
                                {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateProduct;