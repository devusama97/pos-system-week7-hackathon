import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import { COLORS } from '../theme/colors';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.background, overflowX: 'hidden' }}>
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: { xs: 0, md: '104px' }, // Sidebar width responsive
                    p: { xs: 2, md: 4 },
                    pb: { xs: '88px', md: 4 }, // Add space for bottom nav on mobile
                    minHeight: '100vh',
                    width: '100%',
                    maxWidth: { xs: '100vw', md: 'calc(100vw - 104px)' },
                    overflowX: 'hidden'
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
