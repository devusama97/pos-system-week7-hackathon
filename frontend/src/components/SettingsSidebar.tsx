'use client';

import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Typography } from '@mui/material';
import {
    FavoriteBorder,
    Storefront,
    RestaurantMenu,
    NotificationsNone,
    LockOutlined,
    InfoOutlined,
} from '@mui/icons-material';
import { COLORS } from '../theme/colors';

interface SettingsSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const settingsItems = [
    { icon: <FavoriteBorder />, title: 'Appearance', description: 'Dark and Light mode, Font size', id: 'appearance' },
    { icon: <Storefront />, title: 'Your Restaurant', description: 'Dark and Light mode, Font size', id: 'restaurant' },
    { icon: <RestaurantMenu />, title: 'Products Management', description: 'Manage your product, pricing, etc', id: 'products' },
    { icon: <RestaurantMenu />, title: 'Inventory Management', description: 'Manage raw materials and stock', id: 'inventory' },
    { icon: <NotificationsNone />, title: 'Notifications', description: 'Customize your notifications', id: 'notifications' },
    { icon: <LockOutlined />, title: 'Security', description: 'Configure Password, PIN, etc', id: 'security' },
    { icon: <InfoOutlined />, title: 'About Us', description: 'Find out more about Posly', id: 'about' },
];

export default function SettingsSidebar({ activeTab, setActiveTab }: SettingsSidebarProps) {
    return (
        <Box
            sx={{
                width: { xs: '100%', md: '350px' },
                backgroundColor: COLORS.surface,
                borderRadius: '8px',
                overflow: 'hidden',
                height: 'fit-content',
            }}
        >
            <List sx={{ p: 0 }}>
                {settingsItems.map((item, index) => {
                    const isActive = activeTab === item.id;
                    return (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                onClick={() => setActiveTab(item.id)}
                                sx={{
                                    p: 3,
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    position: 'relative',
                                    backgroundColor: isActive ? 'rgba(234, 115, 109, 0.1)' : 'transparent',
                                    borderRight: isActive ? `3px solid ${COLORS.primary}` : 'none',
                                    '&:hover': {
                                        backgroundColor: isActive ? 'rgba(234, 115, 109, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: isActive ? COLORS.primary : COLORS.text.secondary, minWidth: '40px', mt: 0.5 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography variant="body1" sx={{ color: isActive ? COLORS.primary : '#E0E6E9', fontWeight: 600, fontSize: '14px' }}>
                                            {item.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" sx={{ color: COLORS.text.secondary, fontSize: '12px', mt: 0.5 }}>
                                            {item.description}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}

