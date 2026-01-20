'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useGetProfileQuery } from '../store/apis/authApi';
import { Box, CircularProgress } from '@mui/material';
import { COLORS } from '../theme/colors';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = React.useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getValidToken = () => {
        if (typeof window === 'undefined') return null;
        const t = localStorage.getItem('token');
        return (t && t !== 'undefined' && t !== 'null') ? t : null;
    };
    const token = mounted ? getValidToken() : null;

    const { data: user, isLoading, isError } = useGetProfileQuery(undefined, {
        skip: !token,
    });

    useEffect(() => {
        if (isError) {
            localStorage.removeItem('token');
            router.push('/login');
        }
    }, [isError, router]);

    useEffect(() => {
        const publicPaths = ['/login', '/signup'];
        const isPublicPath = publicPaths.includes(pathname);

        if (!token && !isPublicPath) {
            router.push('/login');
        } else if (token && isPublicPath) {
            router.push('/');
        }
    }, [token, pathname, router]);

    // Role-based redirection
    useEffect(() => {
        if (user) {
            const adminOnlyPaths = ['/dashboard', '/settings'];
            if (user.role !== 'admin' && adminOnlyPaths.some(path => pathname.startsWith(path))) {
                router.push('/');
            }
        }
    }, [user, pathname, router]);

    if (isLoading && token) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: COLORS.background
            }}>
                <CircularProgress sx={{ color: COLORS.primary }} />
            </Box>
        );
    }

    return <>{children}</>;
}
