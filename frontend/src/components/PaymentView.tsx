import React from 'react';
import { Box, Typography, TextField, Button, Grid, IconButton, Avatar, MenuItem, Select, Drawer } from '@mui/material';
import { CreditCard, AccountBalanceWallet, ArrowBack, Add } from '@mui/icons-material';
import { COLORS } from '../theme/colors';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearCart } from '../store/slices/cartSlice';
import { useCreateOrderMutation } from '../store/apis/ordersApi';



export default function PaymentView({ onBack, defaultOrderType = 'Dine In' }: { onBack: () => void; defaultOrderType?: string }) {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [createOrder, { isLoading }] = useCreateOrderMutation();

    const [orderType, setOrderType] = React.useState(defaultOrderType);
    const [paymentMethod, setPaymentMethod] = React.useState('Cash');

    const subTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const orderNumber = React.useMemo(() => (Math.random() * 100000).toFixed(0), []);

    const handleSubmit = async () => {
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    product: item.id,
                    quantity: item.quantity,
                    notes: item.note
                })),
                total: subTotal,
                paymentMethod: paymentMethod,
                type: orderType
            };

            await createOrder(orderData).unwrap();
            alert('Order placed successfully!');
            dispatch(clearCart());
            onBack();
        } catch (err) {
            console.error('Failed to place order:', err);
            alert('Failed to place order. Please try again.');
        }
    };

    return (
        <Drawer
            anchor="right"
            open={true}
            onClose={onBack}
            PaperProps={{
                sx: {
                    width: '1050px',
                    backgroundColor: '#1F1D2B',
                    backgroundImage: 'none',
                    borderLeft: `1px solid ${COLORS.divider}`,
                }
            }}
        >
            <Box sx={{ display: 'flex', height: '100%' }}>
                {/* 1. Confirmation Column... (unchanged) */}
                <Box sx={{
                    flex: 1,
                    p: 4,
                    pt: 6,
                    borderRight: `1px solid ${COLORS.divider}`,
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <IconButton onClick={onBack} sx={{ color: '#FFF', alignSelf: 'flex-start', mb: 4, p: 0 }}>
                        <ArrowBack />
                    </IconButton>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h1" sx={{ color: '#FFF', fontSize: '28px' }}>Confirmation</Typography>
                        <IconButton sx={{
                            backgroundColor: COLORS.primary,
                            color: '#FFF',
                            borderRadius: '8px',
                            '&:hover': { backgroundColor: COLORS.primary }
                        }}>
                            <Add />
                        </IconButton>
                    </Box>
                    <Typography variant="body2" sx={{ color: COLORS.text.secondary, mb: 4 }}>Orders #{orderNumber}</Typography>

                    <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {cartItems.map((item, i) => (
                                <Box key={item.id}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                        <Box sx={{ display: 'flex', gap: 1.5, flex: 1 }}>
                                            <Avatar src={item.image || `https://placehold.co/40`} variant="rounded" sx={{ width: 45, height: 45 }} />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 500, color: '#FFF', fontSize: '13px', mb: 0.5 }}>{item.name}</Typography>
                                                <Typography variant="caption" sx={{ color: COLORS.text.secondary }}>$ {item.price}</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                width: '45px',
                                                height: '45px',
                                                backgroundColor: '#2D303E',
                                                border: `1px solid ${COLORS.divider}`,
                                                borderRadius: '8px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                color: '#FFF'
                                            }}>
                                                {item.quantity}
                                            </Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFF', width: '45px', textAlign: 'right' }}>
                                                $ {(item.price * item.quantity).toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <TextField
                                            fullWidth
                                            placeholder="Order Note..."
                                            variant="outlined"
                                            size="small"
                                            defaultValue={item.note || ''}
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
                                        <IconButton sx={{
                                            border: `1px solid ${COLORS.primary}`,
                                            borderRadius: '8px',
                                            width: '45px',
                                            height: '45px',
                                            color: COLORS.primary
                                        }}>
                                            <Add />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Box sx={{ mt: 'auto', pt: 3, borderTop: `1px solid ${COLORS.divider}` }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>Discount</Typography>
                            <Typography variant="body2" sx={{ color: '#FFF' }}>$0</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>Sub total</Typography>
                            <Typography variant="body2" sx={{ color: '#FFF' }}>$ {subTotal.toFixed(2)}</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* 2. Payment Details Column */}
                <Box sx={{ flex: 1, p: 4, pt: 6, display: 'flex', flexDirection: 'column' }}>
                    {/* Spacer to align with back button in the left column */}
                    <Box sx={{ height: '56px' }} />

                    <Typography variant="h1" sx={{ color: '#FFF', fontSize: '28px', mb: 1 }}>Payment</Typography>
                    <Typography variant="body2" sx={{ color: COLORS.text.secondary, mb: 4 }}>3 payment method available</Typography>

                    <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>

                        <Typography variant="h2" sx={{ color: '#FFF', fontSize: '20px', mb: 2 }}>Payment Method</Typography>
                        <Box sx={{ display: 'flex', gap: 1.5, mb: 4 }}>
                            {['Credit Card', 'Paypal', 'Cash'].map((method) => (
                                <Button
                                    key={method}
                                    onClick={() => setPaymentMethod(method)}
                                    variant="outlined"
                                    sx={{
                                        flex: 1,
                                        height: '64px',
                                        borderColor: paymentMethod === method ? COLORS.primary : COLORS.divider,
                                        color: paymentMethod === method ? '#FFF' : COLORS.text.secondary,
                                        textTransform: 'none',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: '8px',
                                        backgroundColor: paymentMethod === method ? 'rgba(234, 115, 109, 0.1)' : 'transparent',
                                        position: 'relative',
                                        '&:hover': {
                                            borderColor: COLORS.primary,
                                            backgroundColor: 'rgba(234, 115, 109, 0.05)'
                                        },
                                        ...((paymentMethod === method) && {
                                            '&::after': {
                                                content: '"✔"',
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                color: COLORS.primary,
                                                fontSize: '12px',
                                            }
                                        })
                                    }}
                                >
                                    {method === 'Credit Card' && <CreditCard sx={{ mb: 0.5, color: paymentMethod === method ? '#FFF' : 'inherit' }} />}
                                    {method === 'Paypal' && <Box component="img" src="https://placehold.co/20" sx={{ mb: 0.5, width: 20, height: 20, filter: 'grayscale(1)' }} />}
                                    {method === 'Cash' && <AccountBalanceWallet sx={{ mb: 0.5 }} />}
                                    <Typography variant="caption">{method}</Typography>
                                </Button>
                            ))}
                        </Box>

                        <Grid container spacing={2}>
                            {paymentMethod === 'Credit Card' && (
                                <>
                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant="body2" sx={{ color: '#FFF', mb: 1 }}>Cardholder Name</Typography>
                                        <TextField
                                            fullWidth
                                            defaultValue="Usama Naseem"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: '#2D303E',
                                                    color: '#FFF',
                                                    borderRadius: '8px',
                                                    '& fieldset': { borderColor: 'transparent' },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant="body2" sx={{ color: '#FFF', mb: 1 }}>Card Number</Typography>
                                        <TextField
                                            fullWidth
                                            defaultValue="2564 1421 0897 1244"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: '#2D303E',
                                                    color: '#FFF',
                                                    borderRadius: '8px',
                                                    '& fieldset': { borderColor: 'transparent' },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="body2" sx={{ color: '#FFF', mb: 1 }}>Expiration Date</Typography>
                                        <TextField
                                            fullWidth
                                            defaultValue="02/2022"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: '#2D303E',
                                                    color: '#FFF',
                                                    borderRadius: '8px',
                                                    '& fieldset': { borderColor: 'transparent' },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="body2" sx={{ color: '#FFF', mb: 1 }}>CVV</Typography>
                                        <TextField
                                            fullWidth
                                            type="password"
                                            defaultValue="123"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: '#2D303E',
                                                    color: '#FFF',
                                                    borderRadius: '8px',
                                                    '& fieldset': { borderColor: 'transparent' },
                                                },
                                            }}
                                        />
                                    </Grid>
                                </>
                            )}
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2" sx={{ color: '#FFF', mb: 1 }}>Order Type</Typography>
                                <Select
                                    fullWidth
                                    value={orderType}
                                    onChange={(e) => setOrderType(e.target.value)}
                                    sx={{
                                        backgroundColor: '#2D303E',
                                        color: '#FFF',
                                        borderRadius: '8px',
                                        '& fieldset': { borderColor: 'transparent' },
                                        '& .MuiSelect-icon': { color: '#FFF' }
                                    }}
                                >
                                    <MenuItem value="Dine In">Dine In</MenuItem>
                                    <MenuItem value="To Go">To Go</MenuItem>
                                    <MenuItem value="Delivery">Delivery</MenuItem>
                                </Select>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2" sx={{ color: '#FFF', mb: 1 }}>Table no.</Typography>
                                <TextField
                                    fullWidth
                                    defaultValue="140"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#2D303E',
                                            color: '#FFF',
                                            borderRadius: '8px',
                                            '& fieldset': { borderColor: 'transparent' },
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ mt: 'auto', pt: 4, borderTop: `1px solid ${COLORS.divider}`, display: 'flex', gap: 1.5 }}>
                        <Button
                            onClick={onBack}
                            variant="outlined"
                            fullWidth
                            sx={{
                                py: 1.8,
                                borderColor: COLORS.primary,
                                color: COLORS.primary,
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { borderColor: COLORS.primary, backgroundColor: 'rgba(234, 115, 109, 0.05)' }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            fullWidth
                            disabled={isLoading || cartItems.length === 0}
                            onClick={handleSubmit}
                            sx={{
                                py: 1.8,
                                backgroundColor: COLORS.primary,
                                color: '#FFF',
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 600,
                                boxShadow: '0px 8px 24px rgba(234, 115, 109, 0.3)',
                                '&:hover': { backgroundColor: COLORS.primary }
                            }}
                        >
                            {isLoading ? 'Processing...' : 'Confirm Payment'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    );
}

