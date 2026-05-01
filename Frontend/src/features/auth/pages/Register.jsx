import React, { useState, useEffect } from 'react';
import { useAuth } from "../hook/useAuth";
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useToast } from "../../../components/Toaster.jsx";
import { setError } from "../state/auth.slice.js";
import fashionModel from '../../../assets/fashion_model.png';

/* ─── Tiny star dots ─── */
const Stars = () => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        {[
            [15, 12], [28, 40], [10, 65], [22, 80], [40, 20],
            [48, 55], [35, 90], [8, 90], [42, 8], [18, 50],
        ].map(([cx, cy], i) => (
            <circle key={i} cx={`${cx}%`} cy={`${cy}%`} r={i % 3 === 0 ? 2.5 : 1.5}
                fill="white" opacity={i % 2 === 0 ? 0.5 : 0.25} />
        ))}
        <line x1="60%" y1="10%" x2="55%" y2="15%" stroke="white" strokeWidth="1" opacity="0.3" />
        <line x1="30%" y1="30%" x2="26%" y2="34%" stroke="white" strokeWidth="1" opacity="0.2" />
    </svg>
);

/* ─── Google SVG ─── */
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const EyeIcon = ({ show }) => (
    show ? (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
    ) : (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    )
);

/* ─── Underline input field ─── */
const Field = ({ label, id, type = 'text', value, onChange, name, required, children }) => (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.45)', paddingBottom: '8px', position: 'relative' }}>
        <input
            id={id} type={type} name={name} value={value}
            onChange={onChange} required={required}
            placeholder={label}
            style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: 'white', fontSize: '13px', letterSpacing: '0.08em',
                width: '100%', fontFamily: "'Inter', sans-serif",
            }}
            onFocus={e => e.target.parentElement.style.borderColor = 'rgba(255,255,255,0.85)'}
            onBlur={e => e.target.parentElement.style.borderColor = 'rgba(255,255,255,0.45)'}
        />
        {children}
    </div>
);

const OutlineBtn = ({ children, onClick, type = 'button', disabled }) => (
    <button type={type} onClick={onClick} disabled={disabled} style={{
        flex: 1, padding: '10px 0', background: 'transparent',
        border: '1px solid rgba(255,255,255,0.6)', borderRadius: '6px',
        color: 'white', fontSize: '12px', letterSpacing: '0.12em',
        cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
        fontFamily: "'Inter', sans-serif", opacity: disabled ? 0.6 : 1,
    }}
        onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
        {children}
    </button>
);

const Register = () => {
    const { handleRegisterUser } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const dispatch = useDispatch();
    const { error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        fullName: '', contactNumber: '', email: '', password: '', isSeller: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => { if (error) toast(error, "error"); }, [error, toast]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (error) dispatch(setError(null));
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await handleRegisterUser({
            email: formData.email, contact: formData.contactNumber,
            password: formData.password, isSeller: formData.isSeller, fullname: formData.fullName,
        });
        setLoading(false);
        if (result?.success) navigate("/");
    };

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

            {/* Full page gradient bg */}
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #4a2c6e 0%, #2d1b4e 40%, #1a1228 100%)',
                fontFamily: "'Inter', sans-serif", padding: '20px',
            }}>
                {/* Card */}
                <div style={{
                    display: 'flex', width: '100%', maxWidth: '820px',
                    minHeight: '520px', borderRadius: '18px', overflow: 'hidden',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
                }}>
                    {/* ── LEFT PANEL ── */}
                    <div style={{
                        flex: 1, position: 'relative', overflow: 'hidden',
                        background: 'linear-gradient(160deg, #3d2255 0%, #2a1640 60%, #1e0f33 100%)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                        minWidth: '240px',
                    }}>
                        <Stars />

                        {/* Fashion image */}
                        <img
                            src={fashionModel}
                            alt="Snitch fashion"
                            style={{
                                position: 'absolute', bottom: 0, left: '50%',
                                transform: 'translateX(-50%)',
                                height: '100%', objectFit: 'cover',
                                objectPosition: 'bottom', zIndex: 1,
                                filter: 'drop-shadow(0 0 30px rgba(200,120,180,0.25))',
                            }}
                        />

                        {/* Brand name */}
                        <div style={{
                            position: 'relative', zIndex: 2, paddingBottom: '22px',
                            letterSpacing: '0.55em', fontSize: '13px', fontWeight: 500,
                            color: '#e8907a', textTransform: 'uppercase',
                        }}>
                            S N I T C H
                        </div>
                    </div>

                    {/* ── RIGHT PANEL ── */}
                    <div style={{
                        flex: 1, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', padding: '40px 38px',
                        background: 'linear-gradient(160deg, #c96060 0%, #b84a4a 60%, #a03a3a 100%)',
                        minWidth: '280px',
                    }}>
                        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '280px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

                            <Field label="Full Name" id="reg-fullName" name="fullName"
                                value={formData.fullName} onChange={handleChange} required />

                            <Field label="Contact Number" id="reg-contact" type="tel" name="contactNumber"
                                value={formData.contactNumber} onChange={handleChange} required />

                            <Field label="Email Address" id="reg-email" type="email" name="email"
                                value={formData.email} onChange={handleChange} required />

                            <Field label="Password" id="reg-password"
                                type={showPassword ? 'text' : 'password'} name="password"
                                value={formData.password} onChange={handleChange} required>
                                <button type="button" onClick={() => setShowPassword(v => !v)}
                                    style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                    <EyeIcon show={showPassword} />
                                </button>
                            </Field>

                            {/* Seller checkbox */}
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'rgba(255,255,255,0.75)', fontSize: '12px', letterSpacing: '0.08em' }}>
                                <div onClick={() => setFormData(p => ({ ...p, isSeller: !p.isSeller }))} style={{
                                    width: '16px', height: '16px', borderRadius: '4px',
                                    border: '1.5px solid rgba(255,255,255,0.6)',
                                    background: formData.isSeller ? 'rgba(255,255,255,0.25)' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s',
                                }}>
                                    {formData.isSeller && (
                                        <svg viewBox="0 0 10 8" width="10" height="8" fill="none">
                                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                                Register as a Seller
                            </label>

                            {/* Buttons row */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                                <OutlineBtn type="submit" disabled={loading}>
                                    {loading ? '...' : 'Sign Up'}
                                </OutlineBtn>
                                <Link to="/login" style={{ flex: 1, textDecoration: 'none' }}>
                                    <OutlineBtn>Sign In</OutlineBtn>
                                </Link>
                            </div>

                            {/* Divider */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.25)' }} />
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', letterSpacing: '0.1em' }}>OR</span>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.25)' }} />
                            </div>

                            {/* Google */}
                            <button type="button" onClick={() => { window.location.href = '/api/auth/google'; }}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    padding: '10px 0', background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.35)', borderRadius: '6px',
                                    color: 'white', fontSize: '11px', letterSpacing: '0.1em',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    fontFamily: "'Inter', sans-serif",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                            >
                                <GoogleIcon /> Continue with Google
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
