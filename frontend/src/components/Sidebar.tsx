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

    // Auth disabled: Show all items
    const filteredNavItems = navItems;

    const handleLogout = () => {
        dispatch(baseApi.util.resetApiState());
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <>
            {/* Desktop Sidebar (Left) */}
            <Box
                component="nav"
                sx={{
                    width: '104px',
                    height: '100vh',
                    backgroundColor: COLORS.sidebar,
                    display: { xs: 'none', md: 'flex' },
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

            {/* Mobile Bottom Navigation (Bottom) */}
            <Box
                component="nav"
                sx={{
                    width: '100%',
                    height: '74px',
                    backgroundColor: COLORS.sidebar, // Use sidebar color or surface
                    display: { xs: 'flex', md: 'none' },
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    zIndex: 1200,
                    borderTop: `1px solid ${COLORS.divider}`,
                    px: 1
                }}
            >
                {filteredNavItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <IconButton
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            sx={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                backgroundColor: isActive ? COLORS.primary : 'transparent',
                                color: isActive ? '#FFF' : COLORS.primary,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: isActive ? COLORS.primary : 'rgba(234, 115, 109, 0.1)',
                                },
                            }}
                        >
                            {item.icon}
                        </IconButton>
                    );
                })}
                <IconButton
                    onClick={handleLogout}
                    sx={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        color: COLORS.primary,
                    }}
                >
                    <Logout />
                </IconButton>
            </Box>
        </>
    );
}
