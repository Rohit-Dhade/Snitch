import { useState } from 'react';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router';

/**
 * Shown once to new Google-authenticated users who haven't picked a role yet.
 * After they pick, needsRoleSetup is cleared and they're routed appropriately.
 */
const RoleSetupModal = () => {
    const { handleSetRole } = useAuth();
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!selected) return;
        setLoading(true);
        const result = await handleSetRole(selected);
        setLoading(false);
        if (result?.success) {
            if (selected === 'seller') {
                navigate('/seller/dashboard');
            } else {
                navigate('/');
            }
        }
    };

    const options = [
        {
            value: 'buyer',
            title: 'Buyer',
            desc: 'Browse and purchase products from sellers.',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
            ),
        },
        {
            value: 'seller',
            title: 'Seller',
            desc: 'List products and manage your store.',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                </svg>
            ),
        },
    ];

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            {/* Backdrop */}
            <div
                style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    backgroundColor: 'rgba(10,9,8,0.82)',
                    backdropFilter: 'blur(6px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px',
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                <div style={{
                    backgroundColor: '#fbf9f6',
                    maxWidth: '440px', width: '100%',
                    padding: '2.5rem',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: '1.75rem' }}>
                        <span style={{
                            fontSize: '10px', textTransform: 'uppercase',
                            letterSpacing: '0.35em', fontWeight: 500,
                            color: '#C9A96E', fontFamily: "'Cormorant Garamond', serif",
                        }}>
                            Welcome to Snitch
                        </span>
                        <h2 style={{
                            fontSize: '1.85rem', fontWeight: 300, lineHeight: 1.2,
                            marginTop: '6px', color: '#1b1c1a',
                            fontFamily: "'Cormorant Garamond', serif",
                        }}>
                            How will you use Snitch?
                        </h2>
                        <div style={{ marginTop: '12px', width: '40px', height: '1px', backgroundColor: '#C9A96E' }} />
                        <p style={{ marginTop: '12px', fontSize: '12px', color: '#7A6E63', lineHeight: 1.6 }}>
                            Pick your role — you can only set this once.
                        </p>
                    </div>

                    {/* Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.75rem' }}>
                        {options.map(opt => {
                            const isSelected = selected === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setSelected(opt.value)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '16px',
                                        padding: '18px 20px',
                                        border: `1.5px solid ${isSelected ? '#C9A96E' : '#e4e2df'}`,
                                        backgroundColor: isSelected ? 'rgba(201,169,110,0.07)' : 'transparent',
                                        cursor: 'pointer', textAlign: 'left',
                                        transition: 'all 0.2s',
                                        outline: 'none',
                                    }}
                                    onMouseEnter={e => {
                                        if (!isSelected) e.currentTarget.style.borderColor = '#C9A96E';
                                    }}
                                    onMouseLeave={e => {
                                        if (!isSelected) e.currentTarget.style.borderColor = '#e4e2df';
                                    }}
                                >
                                    <span style={{ color: isSelected ? '#C9A96E' : '#7A6E63', flexShrink: 0 }}>
                                        {opt.icon}
                                    </span>
                                    <div>
                                        <p style={{
                                            fontSize: '13px', fontWeight: 500,
                                            color: '#1b1c1a', letterSpacing: '0.02em', marginBottom: '3px',
                                        }}>
                                            {opt.title}
                                        </p>
                                        <p style={{ fontSize: '11px', color: '#7A6E63', lineHeight: 1.5 }}>
                                            {opt.desc}
                                        </p>
                                    </div>
                                    {/* Radio indicator */}
                                    <div style={{
                                        marginLeft: 'auto', flexShrink: 0,
                                        width: '16px', height: '16px', borderRadius: '50%',
                                        border: `1.5px solid ${isSelected ? '#C9A96E' : '#B5ADA3'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {isSelected && (
                                            <div style={{
                                                width: '8px', height: '8px', borderRadius: '50%',
                                                backgroundColor: '#C9A96E',
                                            }} />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Confirm */}
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!selected || loading}
                        style={{
                            width: '100%', padding: '14px 0',
                            fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3em',
                            fontWeight: 500, fontFamily: "'Inter', sans-serif",
                            backgroundColor: !selected || loading ? '#e4e2df' : '#1b1c1a',
                            color: !selected || loading ? '#B5ADA3' : '#fbf9f6',
                            border: 'none', cursor: !selected || loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.25s',
                        }}
                        onMouseEnter={e => {
                            if (selected && !loading) e.currentTarget.style.backgroundColor = '#C9A96E';
                        }}
                        onMouseLeave={e => {
                            if (selected && !loading) e.currentTarget.style.backgroundColor = '#1b1c1a';
                        }}
                    >
                        {loading ? 'Saving...' : 'Continue'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default RoleSetupModal;
