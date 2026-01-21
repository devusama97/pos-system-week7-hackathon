'use client';

import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { COLORS } from '../theme/colors';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

interface ProductCardProps {
    product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
    const dispatch = useDispatch();
    const isAvailable = product.availableQuantity > 0;

    const handleAddToCart = () => {
        if (isAvailable) {
            dispatch(addToCart({
                id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                maxAvailable: product.availableQuantity
            }));
        }
    };

    return (
        <Card
            onClick={handleAddToCart}
            sx={{
                backgroundColor: COLORS.surface,
                borderRadius: '16px',
                overflow: 'visible',
                position: 'relative',
                mt: 8,
                pt: 10,
                textAlign: 'center',
                cursor: isAvailable ? 'pointer' : 'not-allowed',
                opacity: isAvailable ? 1 : 0.6,
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: isAvailable ? 'scale(1.02)' : 'none',
                },
            }}
        >
            {/* Unavailable Badge */}
            {!isAvailable && (
                <Chip
                    label="Out of Stock"
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(255, 124, 163, 0.2)',
                        color: '#FF7CA3',
                        fontWeight: 600,
                        fontSize: '11px',
                        height: '24px'
                    }}
                />
            )}

            <Box
                sx={{
                    position: 'absolute',
                    top: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '120px',
                    height: '120px',
                }}
            >
                <Box
                    component="img"
                    src={product.image || 'https://placehold.co/120'}
                    alt={product.name}
                    sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        boxShadow: '0px 10px 20px rgba(0,0,0,0.3)',
                    }}
                />
            </Box>
            <CardContent>
                <Typography variant="body1" sx={{ color: '#FFF', fontWeight: 500, mb: 1, minHeight: '44px' }}>
                    {product.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#FFF', mb: 1 }}>
                    $ {product.price}
                </Typography>
                <Typography variant="body2" sx={{ color: isAvailable ? COLORS.text.secondary : '#FF7CA3' }}>
                    {isAvailable ? `${product.availableQuantity} Bowls available` : 'Unavailable'}
                </Typography>
            </CardContent>
        </Card>
    );
}

