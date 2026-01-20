'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Link, Alert } from '@mui/material';
import { COLORS } from '@/src/theme/colors';
import { useRouter } from 'next/navigation';
import { useSignupMutation } from '@/src/store/apis/authApi';

export default function SignupPage() {
    const router = useRouter();
    const [signup, { isLoading, error }] = useSignupMutation();
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(false);
        try {
            await signup(formData).unwrap();
            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err) {
            console.error('Signup failed:', err);
        }
    };

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.background
        }}>
            <Paper sx={{ p: 4, width: '400px', textAlign: 'center' }}>
                <Typography variant="h1" sx={{ mb: 1 }}>Create Account</Typography>
                <Typography variant="body2" sx={{ color: COLORS.text.secondary, mb: 4 }}>Join Jaegar Resto POS system</Typography>

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        Account created successfully! Redirecting to login...
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Signup failed. Email might already exist.
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSignup} sx={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left' }}>
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>Full Name</Typography>
                        <TextField
                            fullWidth
                            placeholder="Usama Naseem"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </Box>
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>Email Address</Typography>
                        <TextField
                            fullWidth
                            placeholder="chef@jaegar.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </Box>
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>Password</Typography>
                        <TextField
                            fullWidth
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={isLoading}
                        sx={{
                            backgroundColor: COLORS.primary,
                            '&:hover': { backgroundColor: '#D6635D' }
                        }}
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </Box>

                <Typography variant="body2" sx={{ mt: 3, color: COLORS.text.secondary }}>
                    Already have an account? <Link href="/login" sx={{ color: COLORS.primary, textDecoration: 'none' }}>Login</Link>
                </Typography>
            </Paper>
        </Box>
    );
}
