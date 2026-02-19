import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const LoginScreen = () => {
    const { dispatch } = useStore();
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogin = () => {
        if (name.trim()) {
            dispatch({
                type: 'SET_USER',
                payload: { name, avatar }
            });
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'var(--bg-color)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '24px',
                    padding: '40px'
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Welcome</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Set up your workspace</p>
                </div>

                {/* Avatar Upload */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'var(--surface-color)',
                        border: '2px dashed var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative'
                    }}
                >
                    {avatar ? (
                        <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                            <Camera size={24} />
                            <span style={{ fontSize: '0.7rem' }}>Upload</span>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                </div>

                {/* Name Input */}
                <div style={{ width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 }}>Your Name</label>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: 'var(--bg-color)',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <User size={20} color="var(--text-secondary)" />
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                width: '100%',
                                outline: 'none',
                                color: 'var(--text-primary)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleLogin}
                    disabled={!name.trim()}
                    style={{
                        width: '100%',
                        padding: '16px',
                        opacity: name.trim() ? 1 : 0.5,
                        cursor: name.trim() ? 'pointer' : 'not-allowed'
                    }}
                >
                    Get Started <ArrowRight size={20} />
                </button>
            </motion.div>
        </div>
    );
};
