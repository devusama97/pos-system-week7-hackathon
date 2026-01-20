'use client';

import React from 'react';
import MainLayout from '@/src/components/MainLayout';
import { Box, Typography, Tabs, Tab, Grid, TextField, InputAdornment, IconButton, Select, MenuItem, FormControl } from '@mui/material';
import { Search, Storefront } from '@mui/icons-material';
import ProductCard from '@/src/components/ProductCard';
import OrderSidebar from '@/src/components/OrderSidebar';
import { COLORS } from '@/src/theme/colors';
import { useGetProductsQuery } from '@/src/store/apis/productsApi';

const categories = ['Hot Dishes', 'Cold Dishes', 'Soup', 'Grill', 'Appetizer', 'Dessert'];

import PaymentView from '@/src/components/PaymentView';

export default function POSPage() {
  const [activeTab, setActiveTab] = React.useState(0);
  const [showPayment, setShowPayment] = React.useState(false);
  const [orderType, setOrderType] = React.useState('Dine In');
  const [mobileCartOpen, setMobileCartOpen] = React.useState(false);
  const { data: products, isLoading } = useGetProductsQuery();

  const filteredProducts = products?.filter(p => !categories[activeTab] || p.category === categories[activeTab]) || [];

  return (
    <MainLayout>
      <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'row' }}>
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: '100%' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h1" sx={{ color: '#FFF', fontSize: { xs: '24px', md: '28px' }, mb: 0.5 }}>Jaegar Resto</Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>{new Date().toDateString()}</Typography>
            </Box>
            <TextField
              size="small"
              placeholder="Search for food, caffe, etc.."
              sx={{
                width: { xs: '100%', sm: '220px' },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2D303E',
                  color: '#FFF',
                  borderRadius: '8px',
                  fontSize: '12px',
                  '& fieldset': { borderColor: 'transparent' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#FFF', fontSize: '20px' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Category Selection - Mobile/Tablet Dropdown */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
            <FormControl fullWidth>
              <Select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as number)}
                sx={{
                  color: '#FFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  backgroundColor: COLORS.surface,
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.divider,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.primary,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.primary,
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#FFF',
                  },
                }}
              >
                {categories.map((cat, i) => (
                  <MenuItem
                    key={i}
                    value={i}
                    sx={{
                      color: '#FFF',
                      backgroundColor: COLORS.surface,
                      '&:hover': {
                        backgroundColor: 'rgba(234, 115, 109, 0.1)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(234, 115, 109, 0.2)',
                        '&:hover': {
                          backgroundColor: 'rgba(234, 115, 109, 0.3)',
                        },
                      },
                    }}
                  >
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Categories Tabs - Desktop Only */}
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              display: { xs: 'none', md: 'flex' },
              mb: 4,
              borderBottom: `1px solid ${COLORS.divider}`,
              '& .MuiTab-root': {
                color: '#FFF',
                textTransform: 'none',
                minWidth: 'auto',
                mr: 4,
                px: 0,
                fontSize: '14px',
                fontWeight: 600,
                pb: 1.5,
              },
              '& .Mui-selected': { color: COLORS.primary },
              '& .MuiTabs-indicator': { backgroundColor: COLORS.primary, height: '3px' }
            }}
          >
            {categories.map((cat, i) => <Tab key={i} label={cat} />)}
          </Tabs>

          {/* Dishes Grid */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h2" sx={{ color: '#FFF', fontSize: '20px' }}>Choose Dishes</Typography>
          </Box>

          {/* Dishes Grid */}
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {filteredProducts.map((product, index) => (
              <Grid key={product._id || index} size={{ xs: 12, sm: 6, lg: 4 }}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <OrderSidebar
          onContinue={() => setShowPayment(true)}
          orderType={orderType}
          setOrderType={setOrderType}
          open={mobileCartOpen}
          onClose={() => setMobileCartOpen(false)}
        />
      </Box>

      {/* Payment Overlay Slider */}
      {showPayment && <PaymentView onBack={() => setShowPayment(false)} defaultOrderType={orderType} />}

      {/* Mobile Cart Toggle FAB */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, display: { lg: 'none' }, zIndex: 1100 }}>
        <IconButton
          onClick={() => setMobileCartOpen(true)}
          sx={{
            backgroundColor: COLORS.primary,
            color: '#FFF',
            width: 56,
            height: 56,
            boxShadow: 4,
            '&:hover': { backgroundColor: '#D6635D' }
          }}
        >
          <Storefront />
          {/* Note: Storefront is already imported, maybe use ShoppingCart if available, or just Storefront for now */}
        </IconButton>
      </Box>
    </MainLayout>
  );
}

