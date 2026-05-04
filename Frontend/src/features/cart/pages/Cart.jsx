import React, { useEffect } from 'react'
import useCart from '../hook/useCart.js'
import { Link } from 'react-router-dom'
import Navbar from '../../../components/Navbar';

const Cart = () => {
    const { cart, handleViewCart, handleRemoveFromCart, handleUpdateQuantity } = useCart();

    useEffect(() => {
        handleViewCart();
    }, []);

    const items = Array.isArray(cart?.items) ? cart.items : [];

    const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.price?.amount || 0) * (item.quantity || 1), 0);
    }

    return (
        <div className="min-h-screen bg-white selection:bg-black selection:text-white">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
                {/* Header */}
                <div className="flex justify-between items-end border-b border-gray-100 pb-6 mb-8">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black">Your cart</h1>
                    <Link to="/" className="text-sm text-gray-500 hover:text-black underline underline-offset-4 transition-colors mb-2">
                        Continue shopping
                    </Link>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50/50 rounded-2xl">
                        <p className="text-gray-500 mb-6 text-lg">Your cart is currently empty.</p>
                        <Link to="/" className="inline-block bg-black text-white px-8 py-4 font-bold text-sm tracking-wider uppercase hover:bg-gray-900 transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Table Headers */}
                        <div className="hidden md:grid grid-cols-12 gap-4 text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-6 pb-4 border-b border-gray-100">
                            <div className="col-span-7">PRODUCT</div>
                            <div className="col-span-3 text-center">QUANTITY</div>
                            <div className="col-span-2 text-right">TOTAL</div>
                        </div>

                        {/* Cart Items */}
                        <div className="space-y-8 md:space-y-8">
                            {items.map((item) => {
                                const variantObj = item.product?.variant?.find(v => v._id === item.variant);
                                const displayColor = variantObj?.color || item.product?.color;
                                const displayImage = variantObj?.images?.[0]?.url || item.product?.images?.[0]?.url || 'https://via.placeholder.com/150';

                                return (
                                    <div key={item._id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start md:items-center">
                                        {/* Product Info */}
                                        <div className="col-span-1 md:col-span-7 flex gap-6">
                                            <div className="w-28 h-36 md:w-32 md:h-44 flex-shrink-0 bg-gray-100 overflow-hidden">
                                                <img
                                                    src={displayImage}
                                                    alt={item.product?.title}
                                                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-start py-2">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 font-semibold">SNITCH</p>
                                                <h3 className="text-sm font-extrabold text-black uppercase tracking-wide mb-2">{item.product?.title || 'Product Title'}</h3>
                                                <p className="text-sm text-gray-600 mb-3 font-medium">Rs. {(item.price?.amount || 0).toFixed(2)}</p>
                                                <p className="text-xs text-gray-500 mt-2 max-w-[300px] text-justify">{item.product?.description}</p>

                                                <div className="flex flex-wrap gap-4 mt-4">
                                                    {item.size && (
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[8px] uppercase tracking-[0.2em] text-gray-400 font-bold">Size</span>
                                                            <span className="text-[10px] font-bold text-black border border-gray-200 px-2.5 py-1 bg-white">
                                                                {item.size}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {displayColor && (
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[8px] uppercase tracking-[0.2em] text-gray-400 font-bold">Color</span>
                                                            <span className="text-[10px] font-bold text-black border border-gray-200 px-2.5 py-1 bg-white">
                                                                {displayColor}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <Link 
                                                    to={`/product/${item.product?._id}`}
                                                    className="mt-6 text-[9px] uppercase tracking-[0.2em] font-extrabold text-white bg-black px-6 py-2.5 rounded-full hover:bg-[#C9A96E] transition-all duration-500 flex items-center gap-2 w-fit shadow-sm hover:shadow-md"
                                                >
                                                    View Piece
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Quantity & Actions */}
                                        <div className="col-span-1 md:col-span-3 flex items-center justify-between md:justify-center gap-6 mt-2 md:mt-0">
                                            <div className="flex items-center border border-gray-200">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="px-4 py-2 text-gray-500 hover:text-black transition-colors hover:bg-gray-50 disabled:opacity-30"
                                                >-</button>
                                                <span className="px-4 py-2 text-sm font-medium w-12 text-center border-x border-gray-200">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                                    className="px-4 py-2 text-gray-500 hover:text-black transition-colors hover:bg-gray-50"
                                                >+</button>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFromCart(item._id)}
                                                className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                                title="Remove item"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Total Price */}
                                        <div className="col-span-1 md:col-span-2 text-right hidden md:block">
                                            <p className="text-sm font-bold tracking-wide">Rs. {((item.price?.amount || 0) * (item.quantity || 1)).toFixed(2)}</p>
                                            {/* <p className="text-xs text-gray-500 mt-2 max-w-[300px] text-justify">Rohit dHade</p> */}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border-t border-gray-200 mt-12 pt-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="order-2 lg:order-1">
                                <label htmlFor="special-instructions" className="block text-sm text-gray-600 mb-3 font-medium">Order special instructions</label>
                                <textarea
                                    id="special-instructions"
                                    rows="5"
                                    className="w-full border border-gray-200 p-4 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors resize-y"
                                    placeholder="Add notes for your order..."
                                ></textarea>
                            </div>

                            <div className="flex flex-col items-end order-1 lg:order-2">
                                <div className="flex items-center justify-end gap-6 mb-4">
                                    <span className="text-lg font-bold tracking-wide text-gray-900">Estimated total</span>
                                    <span className="text-2xl font-light tracking-wide text-gray-900">Rs. {calculateTotal().toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-8 text-right max-w-sm leading-relaxed">Tax included. <a href="#" className="underline underline-offset-2 hover:text-black transition-colors">Shipping</a> and discounts calculated at checkout.</p>
                                <button className="w-full max-w-md bg-black text-white font-bold text-sm tracking-widest uppercase py-4 px-8 hover:bg-gray-800 transition-colors shadow-lg shadow-black/10">
                                    Check Out
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Cart;