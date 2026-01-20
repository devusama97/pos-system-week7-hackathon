'use client';

import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, IconButton, Tooltip } from '@mui/material';
import {
    Home,
    Assessment,
    Settings,
    Logout,
    Storefront,
} from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { COLORS } from '../theme/colors';
import { useGetProfileQuery } from '../store/apis/authApi';
import { baseApi } from '../store/apis/baseApi';

const navItems = [
    { icon: <Home />, path: '/', label: 'POS', roles: ['admin', 'user'] },
    { icon: <Assessment />, path: '/dashboard', label: 'Dashboard', roles: ['admin'] },
    { icon: <Settings />, path: '/settings', label: 'Settings', roles: ['admin'] },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const { data: user } = useGetProfileQuery();

    const filteredNavItems = navItems.filter(item =>
        !item.roles || (user && item.roles.includes(user.role))
    );

    const handleLogout = () => {
        dispatch(baseApi.util.resetApiState());
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <Box
            sx={{
                width: '104px',
                height: '100vh',
                backgroundColor: COLORS.sidebar,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 3,
                borderRight: `1px solid ${COLORS.divider}`,
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 1200
            }}
        >
            {/* Logo Area */}
            <Box
                sx={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(234, 115, 109, 0.2)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 4,
                    color: COLORS.primary,
                }}
            >
                <Storefront fontSize="large" />
            </Box>

            {/* Navigation Items */}
            <List sx={{ width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {filteredNavItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <ListItem key={item.path} disablePadding sx={{ display: 'flex', justifyContent: 'center', width: 'auto' }}>
                            <Tooltip title={item.label} placement="right">
                                <ListItemButton
                                    onClick={() => router.push(item.path)}
                                    sx={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: isActive ? COLORS.primary : 'transparent',
                                        color: isActive ? '#FFF' : COLORS.primary,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: isActive ? COLORS.primary : 'rgba(234, 115, 109, 0.1)',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            minWidth: 'auto',
                                            color: 'inherit'
                                        }
                                    }}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    );
                })}
            </List>

            {/* Logout */}
            <Tooltip title="Logout" placement="right">
                <IconButton
                    onClick={handleLogout}
                    sx={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        color: COLORS.primary,
                        mt: 'auto',
                        '&:hover': { backgroundColor: 'rgba(234, 115, 109, 0.1)' },
                    }}
                >
                    <Logout />
                </IconButton>
            </Tooltip>
        </Box>
    );
}
