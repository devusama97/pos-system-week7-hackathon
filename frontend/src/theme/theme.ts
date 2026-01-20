'use client';

import { createTheme } from '@mui/material/styles';
import { COLORS } from './colors';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: COLORS.primary,
        },
        secondary: {
            main: COLORS.secondary,
        },
        background: {
            default: COLORS.background,
            paper: COLORS.surface,
        },
        text: {
            primary: COLORS.text.primary,
            secondary: COLORS.text.secondary,
        },
        success: {
            main: COLORS.success,
        },
    },
    typography: {
        fontFamily: 'var(--font-geist-sans), Inter, sans-serif',
        h1: { fontSize: '28px', fontWeight: 600 },
        h2: { fontSize: '20px', fontWeight: 600 },
        body1: { fontSize: '14px' },
        body2: { fontSize: '12px' },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                },
                containedPrimary: {
                    backgroundColor: COLORS.primary,
                    boxShadow: '0px 8px 24px rgba(234, 115, 109, 0.3)',
                    '&:hover': {
                        backgroundColor: '#FF8A84',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: COLORS.surface,
                    borderRadius: '16px',
                },
            },
        },
    },
});
