'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    MenuItem,
    Grid,
    Divider,
} from '@mui/material';
import { Add, DeleteOutline, CloudUpload } from '@mui/icons-material';
import { COLORS } from '../theme/colors';
import { useGetRawMaterialsQuery } from '../store/apis/rawMaterialsApi';
import { useCreateProductMutation, useUpdateProductMutation } from '../store/apis/productsApi';

interface ProductFormModalProps {
    open: boolean;
    onClose: () => void;
    editingProduct?: any;
}

export default function ProductFormModal({ open, onClose, editingProduct }: ProductFormModalProps) {
    const { data: materials } = useGetRawMaterialsQuery();
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Hot Dishes',
        recipe: [{ material: '', quantity: 0 }],
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        if (editingProduct) {
            setFormData({
                name: editingProduct.name,
                price: editingProduct.price.toString(),
                category: editingProduct.category || 'Hot Dishes',
                recipe: editingProduct.recipe.map((item: any) => ({
                    material: item.material._id || item.material,
                    quantity: item.quantity,
                })),
            });
            setImagePreview(editingProduct.image || '');
        } else {
            setFormData({
                name: '',
                price: '',
                category: 'Hot Dishes',
                recipe: [{ material: '', quantity: 0 }],
            });
            setImageFile(null);
            setImagePreview('');
        }
    }, [editingProduct, open]);

    const handleAddRecipeItem = () => {
        setFormData({
            ...formData,
            recipe: [...formData.recipe, { material: '', quantity: 0 }],
        });
    };

    const handleRemoveRecipeItem = (index: number) => {
        const newRecipe = formData.recipe.filter((_, i) => i !== index);
        setFormData({ ...formData, recipe: newRecipe });
    };

    const handleRecipeChange = (index: number, field: string, value: any) => {
        const newRecipe = [...formData.recipe];
        newRecipe[index] = { ...newRecipe[index], [field]: value };
        setFormData({ ...formData, recipe: newRecipe });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        try {
            const productData = new FormData();
            productData.append('name', formData.name);
            productData.append('price', formData.price);
            productData.append('category', formData.category);
            const validRecipe = formData.recipe.filter(item => item.material !== '');
            productData.append('recipe', JSON.stringify(validRecipe));



            if (imageFile) {
                productData.append('image', imageFile);
            }

            if (editingProduct) {
                await updateProduct({ id: editingProduct._id, data: productData }).unwrap();
            } else {
                await createProduct(productData).unwrap();
            }
            onClose();
        } catch (err) {
            console.error('Failed to save product:', err);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: COLORS.surface,
                    color: '#FFF',
                    borderRadius: '12px',
                    p: 1,
                    maxWidth: '700px'
                }
            }}
        >
            <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.divider}`, pb: 2 }}>
                <Typography component="div" variant="h6" sx={{ fontSize: '24px', fontWeight: 600 }}>
                    {editingProduct ? 'Edit Product Details' : 'Add New Product'}
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ mt: 3, px: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {/* Basic Info */}
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 7 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box>
                                    <Typography variant="body2" sx={{ color: COLORS.text.secondary, mb: 1 }}>Product Name</Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter dish name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        sx={{
                                            '& input': { color: '#FFF' },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                                                '&.Mui-focused fieldset': { borderColor: COLORS.primary }
                                            }
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: COLORS.text.secondary, mb: 1 }}>Price ($)</Typography>
                                    <TextField
                                        type="number"
                                        fullWidth
                                        placeholder="0.00"
                                        value={formData.price}
                                        onFocus={(e) => {
                                            if (formData.price === '0' || formData.price === '0.00') {
                                                setFormData({ ...formData, price: '' });
                                            } else {
                                                e.target.select();
                                            }
                                        }}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        sx={{
                                            '& input': { color: '#FFF' },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                                                '&.Mui-focused fieldset': { borderColor: COLORS.primary }
                                            }
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: COLORS.text.secondary, mb: 1 }}>Category</Typography>
                                    <TextField
                                        select
                                        fullWidth
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        sx={{
                                            '& .MuiSelect-select': { color: '#FFF' },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                                                '&.Mui-focused fieldset': { borderColor: COLORS.primary }
                                            }
                                        }}
                                    >
                                        {['Hot Dishes', 'Cold Dishes', 'Soup', 'Grill', 'Appetizer', 'Dessert'].map((cat) => (
                                            <MenuItem key={cat} value={cat} sx={{ color: '#FFF', background: COLORS.surface, '&:hover': { background: 'rgba(255,255,255,0.1)' } }}>
                                                {cat}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 5 }}>
                            <Typography variant="body2" sx={{ color: COLORS.text.secondary, mb: 1 }}>Product Image</Typography>
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '160px',
                                    border: `1px dashed ${COLORS.divider}`,
                                    borderRadius: '12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                    transition: 'all 0.3s',
                                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: COLORS.primary }
                                }}
                                component="label"
                            >
                                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                {imagePreview ? (
                                    <Box component="img" src={imagePreview} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <>
                                        <CloudUpload sx={{ color: COLORS.primary, fontSize: '40px', mb: 1 }} />
                                        <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>Click to upload image</Typography>
                                    </>
                                )}
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{ borderColor: COLORS.divider }} />

                    {/* Recipe Builder */}
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h3" sx={{ fontSize: '18px', fontWeight: 600 }}>Recipe Composition</Typography>
                            <Button
                                startIcon={<Add />}
                                variant="outlined"
                                size="small"
                                onClick={handleAddRecipeItem}
                                sx={{
                                    color: COLORS.primary,
                                    borderColor: COLORS.primary,
                                    borderRadius: '8px',
                                    '&:hover': { borderColor: COLORS.primary, backgroundColor: 'rgba(234, 115, 109, 0.1)' }
                                }}
                            >
                                Add Item
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {formData.recipe.map((item, index) => (
                                <Box key={index} sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="caption" sx={{ color: COLORS.text.secondary, display: 'block', mb: 0.5 }}>Material</Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            size="small"
                                            value={item.material}
                                            onChange={(e) => handleRecipeChange(index, 'material', e.target.value)}
                                            sx={{
                                                '& .MuiSelect-select': { color: '#FFF' },
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                                                    '&.Mui-focused fieldset': { borderColor: COLORS.primary }
                                                }
                                            }}
                                        >
                                            {(materials || []).map((m: any) => (
                                                <MenuItem key={m._id} value={m._id} sx={{ color: '#FFF', background: COLORS.surface, '&:hover': { background: 'rgba(255,255,255,0.1)' } }}>
                                                    {m.name} ({m.unit})
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                    <Box sx={{ width: '140px' }}>
                                        <Typography variant="caption" sx={{ color: COLORS.text.secondary, display: 'block', mb: 0.5 }}>Qty</Typography>
                                        <TextField
                                            type="number"
                                            size="small"
                                            fullWidth
                                            placeholder="0"
                                            sx={{
                                                '& input': { color: '#FFF' },
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                                                    '&.Mui-focused fieldset': { borderColor: COLORS.primary }
                                                }
                                            }}
                                            value={item.quantity === 0 ? '' : item.quantity}
                                            onFocus={(e) => {
                                                if (item.quantity === 0) {
                                                    handleRecipeChange(index, 'quantity', '');
                                                } else {
                                                    e.target.select();
                                                }
                                            }}
                                            onChange={(e) => handleRecipeChange(index, 'quantity', e.target.value === '' ? 0 : Number(e.target.value))}
                                        />
                                    </Box>
                                    <IconButton
                                        onClick={() => handleRemoveRecipeItem(index)}
                                        sx={{
                                            color: COLORS.error,
                                            mt: 3,
                                            '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.1)' }
                                        }}
                                    >
                                        <DeleteOutline />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 4, pt: 2, borderTop: `1px solid ${COLORS.divider}` }}>
                <Button onClick={onClose} sx={{ color: COLORS.text.secondary, px: 3 }}>Cancel</Button>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    sx={{
                        backgroundColor: COLORS.primary,
                        px: 5,
                        borderRadius: '8px',
                        fontWeight: 600,
                        '&:hover': { backgroundColor: '#D6635D' }
                    }}
                >
                    {editingProduct ? 'Save Changes' : 'Add Product'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
