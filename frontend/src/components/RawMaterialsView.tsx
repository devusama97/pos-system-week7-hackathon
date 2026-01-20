'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Alert,
    MenuItem,
} from '@mui/material';
import { Add, EditOutlined, DeleteOutline } from '@mui/icons-material';
import { COLORS } from '../theme/colors';
import {
    useGetRawMaterialsQuery,
    useCreateRawMaterialMutation,
    useUpdateRawMaterialMutation,
    useDeleteRawMaterialMutation,
} from '../store/apis/rawMaterialsApi';

const UNITE_OPTIONS = [
    { label: 'Gram (g)', value: 'g' },
    { label: 'Kilogram (kg)', value: 'kg' },
    { label: 'Milliliter (ml)', value: 'ml' },
    { label: 'Liter (l)', value: 'l' },
    { label: 'Piece (pcs)', value: 'pcs' },
    { label: 'Ounce (oz)', value: 'oz' },
    { label: 'Bundle', value: 'bundle' },
];

export default function RawMaterialsView() {
    const { data: materials, isLoading, error } = useGetRawMaterialsQuery();
    const [createMaterial] = useCreateRawMaterialMutation();
    const [updateMaterial] = useUpdateRawMaterialMutation();
    const [deleteMaterial] = useDeleteRawMaterialMutation();

    const [open, setOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        unit: '',
        quantity: 0,
        minStockLevel: 0,
    });

    const handleOpen = (material?: any) => {
        if (material) {
            setEditingMaterial(material);
            setFormData({
                name: material.name,
                unit: material.unit,
                quantity: material.quantity,
                minStockLevel: material.minStockLevel || 0,
            });
        } else {
            setEditingMaterial(null);
            setFormData({ name: '', unit: '', quantity: 0, minStockLevel: 0 });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingMaterial(null);
    };

    const handleSubmit = async () => {
        try {
            if (editingMaterial) {
                await updateMaterial({ id: editingMaterial._id, data: formData }).unwrap();
            } else {
                await createMaterial(formData).unwrap();
            }
            handleClose();
        } catch (err) {
            console.error('Failed to save material:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this material?')) {
            try {
                await deleteMaterial(id).unwrap();
            } catch (err) {
                console.error('Failed to delete material:', err);
            }
        }
    };

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress color="primary" /></Box>;
    if (error) return <Alert severity="error">Error loading materials</Alert>;

    return (
        <Box sx={{
            flexGrow: 1,
            backgroundColor: COLORS.surface,
            borderRadius: '8px',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '600px'
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h2" sx={{ color: '#FFF', fontSize: '20px', fontWeight: 600 }}>Raw Materials Inventory</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpen()}
                    sx={{
                        backgroundColor: COLORS.primary,
                        color: '#FFF',
                        borderRadius: '8px',
                        textTransform: 'none',
                        px: 3,
                        '&:hover': { backgroundColor: '#D6635D' }
                    }}
                >
                    Add Material
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow sx={{ '& th': { borderBottom: `2px solid ${COLORS.divider}`, color: COLORS.text.secondary, fontWeight: 600 } }}>
                            <TableCell>Material Name</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Current Stock</TableCell>
                            <TableCell>Alert Level</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {materials?.map((material) => (
                            <TableRow key={material._id} sx={{ '& td': { borderBottom: `1px solid ${COLORS.divider}`, color: '#FFF' } }}>
                                <TableCell sx={{ fontWeight: 500 }}>{material.name}</TableCell>
                                <TableCell>{material.unit}</TableCell>
                                <TableCell>
                                    <Typography sx={{
                                        color: material.quantity <= material.minStockLevel ? COLORS.error : COLORS.success,
                                        fontWeight: 600
                                    }}>
                                        {material.quantity} {material.unit}
                                    </Typography>
                                </TableCell>
                                <TableCell>{material.minStockLevel} {material.unit}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpen(material)} sx={{ color: COLORS.text.secondary }}>
                                        <EditOutlined fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(material._id)} sx={{ color: COLORS.error }}>
                                        <DeleteOutline fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { backgroundColor: COLORS.surface, color: '#FFF', width: '400px' } }}>
                <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.divider}` }}>
                    {editingMaterial ? 'Edit Material' : 'Add New Material'}
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                        <TextField
                            label="Material Name"
                            fullWidth
                            size="small"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            sx={{
                                '& label': { color: COLORS.text.secondary },
                                '& input': { color: '#FFF' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                                    '&.Mui-focused fieldset': { borderColor: COLORS.primary }
                                }
                            }}
                        />
                        <TextField
                            select
                            label="Unit"
                            fullWidth
                            size="small"
                            value={formData.unit}
                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                            sx={{
                                '& label': { color: COLORS.text.secondary },
                                '& .MuiSelect-select': { color: '#FFF' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                                    '&.Mui-focused fieldset': { borderColor: COLORS.primary }
                                }
                            }}
                        >
                            {UNITE_OPTIONS.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value} sx={{ color: '#FFF', background: COLORS.surface, '&:hover': { background: 'rgba(255,255,255,0.1)' } }}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Current Quantity"
                            type="number"
                            fullWidth
                            size="small"
                            placeholder="0"
                            value={formData.quantity === 0 ? '' : formData.quantity}
                            onFocus={(e) => {
                                if (formData.quantity === 0) {
                                    setFormData({ ...formData, quantity: '' as any });
                                } else {
                                    e.target.select();
                                }
                            }}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value === '' ? 0 : Number(e.target.value) })}
                            sx={{
                                '& label': { color: COLORS.text.secondary },
                                '& input': { color: '#FFF' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                                    '&.Mui-focused fieldset': { borderColor: COLORS.primary }
                                }
                            }}
                        />
                        <TextField
                            label="Min Stock Level (Alert)"
                            type="number"
                            fullWidth
                            size="small"
                            placeholder="0"
                            value={formData.minStockLevel === 0 ? '' : formData.minStockLevel}
                            onFocus={(e) => {
                                if (formData.minStockLevel === 0) {
                                    setFormData({ ...formData, minStockLevel: '' as any });
                                } else {
                                    e.target.select();
                                }
                            }}
                            onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value === '' ? 0 : Number(e.target.value) })}
                            sx={{
                                '& label': { color: COLORS.text.secondary },
                                '& input': { color: '#FFF' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                                    '&.Mui-focused fieldset': { borderColor: COLORS.primary }
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: `1px solid ${COLORS.divider}` }}>
                    <Button onClick={handleClose} sx={{ color: COLORS.text.secondary }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: COLORS.primary, '&:hover': { backgroundColor: '#D6635D' } }}>
                        {editingMaterial ? 'Update' : 'Add Material'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
