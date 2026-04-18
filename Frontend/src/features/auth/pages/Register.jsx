import React, { useState, useEffect } from 'react';
import { useAuth } from "../hook/useAuth";
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useToast } from "../../../components/Toaster.jsx";
import { setError } from "../state/auth.slice.js";


const WavyBackground = () => (
    <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.05] z-0" 
         preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
        {[...Array(40)].map((_, i) => (
            <path key={i} d={`M-200,${i*40} Q300,${i*40 - 150} 700,${i*40} T1200,${i*40}`} fill="none" stroke="#ebc136" strokeWidth="1" />
        ))}
    </svg>
);

const EyeIcon = ({ show }) => (
    show ? (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
    ) : (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
    )
);

const Register = () => {
    const { handleRegisterUser } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const dispatch = useDispatch();
    const { error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        email: '',
        password: '',
        isSeller: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (error) {
            toast(error, "error");
        }
    }, [error, toast]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (error) dispatch(setError(null));
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await handleRegisterUser({
            email: formData.email,
            contact: formData.contactNumber,
            password: formData.password,
            isSeller: formData.isSeller,
            fullname: formData.fullName
        });
        setLoading(false);
        if (result?.success) navigate("/");
    };

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
            <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8" style={{ backgroundColor: '#0f1412', fontFamily: "'Inter', sans-serif" }}>
                <WavyBackground />
                <div className="w-full max-w-5xl rounded-[16px] relative z-10 flex flex-col shadow-2xl my-auto" style={{ backgroundColor: '#131816', minHeight: '80vh' }}>
                    
                    <nav className="flex justify-between items-center px-10 py-6 lg:px-14 lg:py-6">
                        <div className="font-extrabold text-[15px] tracking-[0.1em] text-white">Snitch.</div>
                    </nav>

                    <div className="flex-1 flex flex-col md:flex-row relative">
                        <div className="w-full md:w-1/2 flex flex-col px-10 lg:px-14 pb-12 justify-center z-10">
                            <h1 className="text-2xl lg:text-3xl font-black tracking-widest mb-1.5 uppercase" style={{ color: '#ebc136' }}>
                                CREATE ACCOUNT
                            </h1>
                            <p className="text-[#8A938F] text-[13px] mb-8 font-bold tracking-wider">
                                Already have an account? <Link to="/login" style={{ color: '#ebc136' }} className="hover:underline">Sign in</Link>
                            </p>

                            <div className="flex flex-col w-full max-w-[340px]">
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-white text-[12px] font-bold tracking-widest" htmlFor="reg-fullName">Full Name</label>
                                    <input id="reg-fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="e.g. John Doe"
                                        className="bg-transparent border rounded-full px-5 py-2.5 text-[13px] text-[#8A938F] outline-none w-full transition-colors focus:bg-[#18211b]"
                                        style={{ borderColor: '#ebc136' }} />
                                </div>
                                
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-white text-[12px] font-bold tracking-widest" htmlFor="reg-contact">Contact Number</label>
                                    <input id="reg-contact" type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required placeholder="+91 98765 43210"
                                        className="bg-transparent border rounded-full px-5 py-2.5 text-[13px] text-[#8A938F] outline-none w-full transition-colors focus:bg-[#18211b]"
                                        style={{ borderColor: '#ebc136' }} />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-white text-[12px] font-bold tracking-widest" htmlFor="reg-email">Email Address</label>
                                    <input id="reg-email" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="hello@example.com"
                                        className="bg-transparent border rounded-full px-5 py-2.5 text-[13px] text-[#8A938F] outline-none w-full transition-colors focus:bg-[#18211b]"
                                        style={{ borderColor: '#ebc136' }} />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-white text-[12px] font-bold tracking-widest" htmlFor="reg-password">Password</label>
                                    <div className="relative">
                                        <input id="reg-password" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••"
                                            className="bg-transparent border rounded-full px-5 py-2.5 pr-12 text-[13px] text-[#8A938F] outline-none w-full transition-colors focus:bg-[#18211b]"
                                            style={{ borderColor: '#ebc136', letterSpacing: formData.password ? '0.2em' : 'normal' }} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8A938F] hover:text-[#ebc136] transition-colors">
                                            <EyeIcon show={showPassword} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-1 px-1">
                                    <label className="flex items-center gap-2.5 cursor-pointer text-[#8A938F] text-[12px] font-semibold tracking-wider">
                                        <div className="relative flex items-center justify-center">
                                            <input type="checkbox" name="isSeller" checked={formData.isSeller} onChange={handleChange} className="sr-only" />
                                            <div className="w-3.5 h-3.5 rounded-full border transition-colors flex items-center justify-center" style={{ borderColor: '#ebc136' }}>
                                                {formData.isSeller && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#ebc136' }}></div>}
                                            </div>
                                        </div>
                                        Register as a Seller
                                    </label>
                                </div>

                                <button type="submit" disabled={loading}
                                    className="w-full rounded-full py-3.5 mt-2 font-bold text-[14px] tracking-widest uppercase transition-all hover:opacity-90 disabled:opacity-50"
                                    style={{ backgroundColor: '#ebc136', color: '#131816' }}>
                                    {loading ? "..." : "Sign Up"}
                                </button>
                                </form>
                                <div className="relative mt-5 flex items-center justify-center">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t" style={{ borderColor: 'rgba(235,193,54,0.3)' }}></div>
                                    </div>
                                    <div className="relative px-4 text-[12px] font-bold tracking-wider" style={{ backgroundColor: '#131816', color: '#8A938F' }}>
                                        OR
                                    </div>
                                </div>
                                <button type="button" onClick={() => {window.location.href = "/api/auth/google"}}
                                    className="w-full rounded-full py-[12px] mt-5 font-bold text-[13px] tracking-widest transition-all flex items-center justify-center gap-3 border hover:bg-[#18211b]"
                                    style={{ borderColor: 'rgba(235,193,54,0.5)' }}>
                                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span className="text-white">CONTINUE WITH GOOGLE</span>
                                </button>
                            </div>
                        </div>

                        {/* Right side Image / Avatar */}
                        <div className="w-full md:w-1/2 flex items-center justify-center relative p-10 hidden md:flex">
                            <div className="relative flex items-center justify-center w-[300px] h-[300px] lg:w-[350px] lg:h-[350px]">
                                <div className="absolute w-[95%] h-[95%] rounded-full shadow-[0_0_80px_rgba(235,193,54,0.15)]" style={{ backgroundColor: '#ebc136' }}></div>
                                <img src="https://i.pinimg.com/736x/80/7a/8f/807a8f939dc610d06b670d14ea8dcbd4.jpg" 
                                     alt="Avatar"
                                     className="absolute w-full h-full object-cover rounded-full z-10"
                                />
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
        </>
    );
};

export default Register;
