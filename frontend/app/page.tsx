'use client';

import React from 'react';
import MainLayout from '@/src/components/MainLayout';
import { Box, Typography, Tabs, Tab, Grid, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
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
  const { data: products, isLoading } = useGetProductsQuery();

  const filteredProducts = products?.filter(p => !categories[activeTab] || p.category === categories[activeTab]) || [];

  return (
    <MainLayout>
      <Box sx={{ display: 'flex', minHeight: '100vh', mr: '400px' }}>
        <Box sx={{ flexGrow: 1, p: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography variant="h1" sx={{ color: '#FFF', fontSize: '28px', mb: 0.5 }}>Jaegar Resto</Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>{new Date().toDateString()}</Typography>
            </Box>
            <TextField
              size="small"
              placeholder="Search for food, caffe, etc.."
              sx={{
                width: '220px',
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

          {/* Categories Tabs */}
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
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
              <Grid key={product._id || index} size={{ xs: 12, sm: 6, md: 4 }}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <OrderSidebar
          onContinue={() => setShowPayment(true)}
          orderType={orderType}
          setOrderType={setOrderType}
        />
      </Box>

      {/* Payment Overlay Slider */}
      {showPayment && <PaymentView onBack={() => setShowPayment(false)} defaultOrderType={orderType} />}
    </MainLayout>
  );
}

