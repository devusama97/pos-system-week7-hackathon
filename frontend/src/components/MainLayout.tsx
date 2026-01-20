import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import { COLORS } from '../theme/colors';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.background }}>
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: '104px', // Sidebar width
                    p: 4,
                    minHeight: '100vh',
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
