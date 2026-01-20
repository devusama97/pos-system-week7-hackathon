'use client';

import React from 'react';
import MainLayout from '@/src/components/MainLayout';
import { Box, Typography } from '@mui/material';
import SettingsSidebar from '@/src/components/SettingsSidebar';
import ProductsManagementView from '@/src/components/ProductsManagementView';
import RawMaterialsView from '@/src/components/RawMaterialsView';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = React.useState('products');

    const renderView = () => {
        switch (activeTab) {
            case 'products':
                return <ProductsManagementView />;
            case 'inventory':
                return <RawMaterialsView />;
            default:
                return (
                    <Box sx={{ p: 4, backgroundColor: '#252836', borderRadius: '8px', flexGrow: 1 }}>
                        <Typography variant="h2" sx={{ color: '#FFF' }}>Under Development</Typography>
                        <Typography sx={{ color: '#ABBBC2', mt: 1 }}>This section is coming soon.</Typography>
                    </Box>
                );
        }
    };

    return (
        <MainLayout>
            <Box sx={{ color: '#FFF' }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h1" sx={{ color: '#FFF', fontSize: '28px', mb: 0.5 }}>Settings</Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                    <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    {renderView()}
                </Box>
            </Box>
        </MainLayout>
    );
}

