'use client';

import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { COLORS } from '../theme/colors';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

interface ProductCardProps {
    product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        if (product.availableQuantity > 0) {
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
                cursor: product.availableQuantity > 0 ? 'pointer' : 'not-allowed',
                opacity: product.availableQuantity > 0 ? 1 : 0.6,
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: product.availableQuantity > 0 ? 'scale(1.02)' : 'none',
                },
            }}
        >
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
                <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                    {product.availableQuantity} Bowls available
                </Typography>
            </CardContent>
        </Card>
    );
}

