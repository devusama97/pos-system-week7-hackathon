'use client';

import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Grid, Paper, Button, IconButton, Divider } from '@mui/material';
import { Add, EditOutlined, Tune, DeleteOutline } from '@mui/icons-material';
import { COLORS } from '../theme/colors';
import { useGetProductsQuery, useDeleteProductMutation } from '../store/apis/productsApi';
import ProductFormModal from './ProductFormModal';

const categories = ['Hot Dishes', 'Cold Dishes', 'Soup', 'Grill', 'Appetizer', 'Dessert'];


export default function ProductsManagementView() {
    const [activeTab, setActiveTab] = useState(0);
    const { data: products, isLoading } = useGetProductsQuery();
    const [deleteProduct] = useDeleteProductMutation();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const filteredProducts = products?.filter(p => !categories[activeTab] || p.category === categories[activeTab]) || [];

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setModalOpen(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id).unwrap();
        }
    };

    return (
        <Box sx={{
            flexGrow: 1,
            backgroundColor: COLORS.surface,
            borderRadius: '8px',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: 'fit-content',
            minHeight: '600px'
        }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h2" sx={{ color: '#FFF', fontSize: '20px', fontWeight: 600 }}>Products Management</Typography>
                <Button
                    variant="outlined"
                    startIcon={<Tune fontSize="small" />}
                    sx={{
                        color: '#FFF',
                        borderColor: COLORS.divider,
                        borderRadius: '8px',
                        textTransform: 'none',
                        px: 2,
                        fontSize: '14px',
                        height: '40px',
                        '&:hover': { borderColor: COLORS.primary }
                    }}
                >
                    Manage Categories
                </Button>
            </Box>

            {/* Category Tabs */}
            <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                sx={{
                    mb: 3,
                    minHeight: 'auto',
                    '& .MuiTabs-flexContainer': { gap: 4 },
                    '& .MuiTab-root': {
                        color: '#FFF',
                        textTransform: 'none',
                        fontSize: '14px',
                        fontWeight: 600,
                        minWidth: 'auto',
                        minHeight: 'auto',
                        p: 0,
                        pb: 1.5,
                        '&.Mui-selected': { color: COLORS.primary }
                    },
                    '& .MuiTabs-indicator': { backgroundColor: COLORS.primary, height: '3px' }
                }}
            >
                {categories.map((cat, index) => (
                    <Tab key={index} label={cat} />
                ))}
            </Tabs>

            <Divider sx={{ mb: 4, borderColor: COLORS.divider }} />

            {/* Product Grid */}
            <Box sx={{
                flexGrow: 1,
                overflowY: 'auto',
                maxHeight: '480px',
                pr: 1
            }}>
                <Grid container spacing={3}>
                    {/* Add New Dish */}
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                        <Box
                            onClick={handleAdd}
                            sx={{
                                height: '100%',
                                minHeight: '260px',
                                border: `2px dashed ${COLORS.primary}`,
                                borderRadius: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                gap: 1,
                                backgroundColor: 'transparent',
                                transition: 'all 0.3s ease',
                                '&:hover': { backgroundColor: 'rgba(234, 115, 109, 0.05)' }
                            }}
                        >
                            <Add sx={{ color: COLORS.primary, fontSize: '32px' }} />
                            <Typography sx={{ color: COLORS.primary, fontWeight: 600, fontSize: '14px' }}>Add new dish</Typography>
                        </Box>
                    </Grid>

                    {/* Product Cards */}
                    {filteredProducts.map((product, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={product._id || index}>
                            <Paper
                                sx={{
                                    backgroundColor: COLORS.background,
                                    borderRadius: '8px',
                                    border: `1px solid ${COLORS.divider}`,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    pt: 3,
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { borderColor: COLORS.primary }
                                }}
                            >
                                <Box
                                    component="img"
                                    src={product.image || 'https://placehold.co/150'}
                                    sx={{
                                        width: '150px',
                                        height: '150px',
                                        borderRadius: '50%',
                                        mb: 2,
                                        objectFit: 'cover'
                                    }}
                                />
                                <Typography
                                    variant="body1"
                                    align="center"
                                    sx={{
                                        color: '#FFF',
                                        px: 2,
                                        mb: 1,
                                        fontWeight: 500,
                                        fontSize: '14px',
                                        lineHeight: 1.3,
                                        height: '36px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" align="center" sx={{ color: COLORS.text.secondary, mb: 3, fontSize: '14px' }}>
                                    $ {product.price} • {product.availableQuantity || 0} Bowls
                                </Typography>
                                <Box sx={{ display: 'flex', width: '100%' }}>
                                    <Button
                                        fullWidth
                                        onClick={() => handleEdit(product)}
                                        startIcon={<EditOutlined sx={{ fontSize: '18px' }} />}
                                        sx={{
                                            py: 1.5,
                                            backgroundColor: 'rgba(234, 115, 109, 0.2)',
                                            color: COLORS.primary,
                                            textTransform: 'none',
                                            borderRadius: 0,
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            '&:hover': { backgroundColor: 'rgba(234, 115, 109, 0.3)' }
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <IconButton
                                        onClick={() => handleDelete(product._id)}
                                        sx={{
                                            borderRadius: 0,
                                            backgroundColor: 'rgba(255, 124, 163, 0.1)',
                                            color: COLORS.error,
                                            '&:hover': { backgroundColor: 'rgba(255, 124, 163, 0.2)' }
                                        }}
                                    >
                                        <DeleteOutline />
                                    </IconButton>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <ProductFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                editingProduct={editingProduct}
            />
        </Box>
    );
}

