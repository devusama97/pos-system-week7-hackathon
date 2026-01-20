'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Link, Alert } from '@mui/material';
import { COLORS } from '@/src/theme/colors';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '@/src/store/apis/authApi';
import { baseApi } from '@/src/store/apis/baseApi';

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [login, { isLoading, error }] = useLoginMutation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await login({ email, password }).unwrap();
            dispatch(baseApi.util.resetApiState());
            localStorage.setItem('token', result.access_token);
            router.push('/');
        } catch (err) {
            console.error('Login failed:', err);
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
                <Typography variant="h1" sx={{ mb: 1 }}>Welcome Back</Typography>
                <Typography variant="body2" sx={{ color: COLORS.text.secondary, mb: 4 }}>Please login to your account</Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Login failed. Please check your credentials.
                    </Alert>
                )}

                <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left' }}>
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>Email Address</Typography>
                        <TextField
                            fullWidth
                            placeholder="chef@jaegar.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Box>
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>Password</Typography>
                        <TextField
                            fullWidth
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </Box>

                <Typography variant="body2" sx={{ mt: 3, color: COLORS.text.secondary }}>
                    Don't have an account? <Link href="/signup" sx={{ color: COLORS.primary, textDecoration: 'none' }}>Sign up</Link>
                </Typography>
            </Paper>
        </Box>
    );
}
