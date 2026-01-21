'use client';

import React from 'react';
import { Box, Typography, Button, Divider, IconButton, TextField, List, ListItem, Avatar, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { DeleteOutline, Close } from '@mui/icons-material'; // Added Close icon
import { COLORS } from '../theme/colors';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { removeFromCart, updateQuantity, updateNote } from '../store/slices/cartSlice';

interface OrderSidebarProps {
    onContinue: () => void;
    orderType: string;
    setOrderType: (type: string) => void;
    open?: boolean;
    onClose?: () => void;
}

export default function OrderSidebar({ onContinue, orderType, setOrderType, open, onClose }: OrderSidebarProps) {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg')); // Large screens only

    const subTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const content = (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                backgroundColor: COLORS.surface,
                p: 3,
                pt: 4,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Mobile Close Button */}
            {!isDesktop && (
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', top: 10, right: 10, color: '#FFF' }}
                >
                    <Close />
                </IconButton>
            )}
            <Typography variant="h2" sx={{ mb: 3, color: '#FFF' }}>Orders #{(Math.random() * 100000).toFixed(0)}</Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
                {['Dine In', 'To Go', 'Delivery'].map((type) => (
                    <Button
                        key={type}
                        variant={orderType === type ? "contained" : "outlined"}
                        size="small"
                        onClick={() => setOrderType(type)}
                        sx={{
                            backgroundColor: orderType === type ? COLORS.primary : 'transparent',
                            color: orderType === type ? '#FFF' : COLORS.primary,
                            borderColor: orderType === type ? 'transparent' : COLORS.divider,
                            borderRadius: '8px',
                            px: 2,
                            py: 0.5,
                            '&:hover': {
                                backgroundColor: orderType === type ? '#D6635D' : 'rgba(234, 115, 109, 0.1)',
                                borderColor: orderType === type ? 'transparent' : COLORS.primary
                            }
                        }}
                    >
                        {type}
                    </Button>
                ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, px: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFF' }}>Item</Typography>
                <Box sx={{ display: 'flex', gap: 4 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFF' }}>Qty</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFF' }}>Price</Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 2, borderColor: COLORS.divider }} />

            <List sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
                {cartItems.map((item) => (
                    <Box key={item.id} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                            <Box sx={{ display: 'flex', gap: 1.5, flex: 1 }}>
                                <Avatar src={item.image || `https://placehold.co/40`} variant="rounded" sx={{ width: 40, height: 40 }} />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#FFF', fontSize: '12px', mb: 0.5 }}>{item.name}</Typography>
                                    <Typography variant="caption" sx={{ color: COLORS.text.secondary }}>$ {item.price}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <TextField
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => dispatch(updateQuantity({ id: item.id, quantity: Number(e.target.value) }))}
                                    sx={{
                                        width: '50px',
                                        '& .MuiInputBase-root': {
                                            height: '40px',
                                            backgroundColor: '#2D303E',
                                            color: '#FFF',
                                            fontSize: '14px',
                                            borderRadius: '8px',
                                            '& fieldset': { borderColor: COLORS.divider },
                                        },
                                        '& input': { textAlign: 'center', p: 0.5 }
                                    }}
                                />
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFF', width: '55px', textAlign: 'right' }}>
                                    $ {(item.price * item.quantity).toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                placeholder="Order note..."
                                variant="outlined"
                                size="small"
                                value={item.note || ''}
                                onChange={(e) => dispatch(updateNote({ id: item.id, note: e.target.value }))}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#2D303E',
                                        color: COLORS.text.secondary,
                                        fontSize: '12px',
                                        borderRadius: '8px',
                                        '& fieldset': { borderColor: 'transparent' },
                                    },
                                }}
                            />
                            <IconButton
                                onClick={() => dispatch(removeFromCart(item.id))}
                                sx={{
                                    color: COLORS.error,
                                    border: `1px solid ${COLORS.error}`,
                                    borderRadius: '8px',
                                    width: '45px',
                                    height: '45px'
                                }}
                            >
                                <DeleteOutline />
                            </IconButton>
                        </Box>
                    </Box>
                ))}
            </List>

            <Box sx={{ mt: 'auto', pt: 3, borderTop: `1px solid ${COLORS.divider}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>Discount</Typography>
                    <Typography variant="body2" sx={{ color: '#FFF' }}>$0</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>Sub total</Typography>
                    <Typography variant="body2" sx={{ color: '#FFF' }}>$ {subTotal.toFixed(2)}</Typography>
                </Box>
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={cartItems.length === 0}
                    onClick={onContinue}
                    sx={{
                        backgroundColor: COLORS.primary,
                        color: '#FFF',
                        py: 1.8,
                        fontSize: '14px',
                        fontWeight: 600,
                        boxShadow: '0px 8px 24px rgba(234, 115, 109, 0.3)',
                        '&:hover': { backgroundColor: '#D6635D' }
                    }}
                >
                    Continue to Payment
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box component="nav" sx={{ width: { lg: 400 }, flexShrink: { lg: 0 } }}>
            {/* Mobile/Tablet Drawer */}
            <Drawer
                variant="temporary"
                open={open}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', lg: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: { xs: '100%', sm: 400 }, backgroundColor: COLORS.surface, borderLeft: `1px solid ${COLORS.divider}` },
                }}
                anchor="right"
            >
                {content}
            </Drawer>

            {/* Desktop Permanent Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', lg: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 400, backgroundColor: COLORS.surface, borderLeft: `1px solid ${COLORS.divider}` },
                }}
                open
                anchor="right"
            >
                {content}
            </Drawer>
        </Box>
    );
}

