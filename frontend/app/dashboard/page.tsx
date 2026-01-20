'use client';

import React from 'react';
import MainLayout from '@/src/components/MainLayout';
import {
    Box,
    Grid,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Chip,
    IconButton,
    Button,
    Select,
    MenuItem,
    Divider
} from '@mui/material';
import {
    AttachMoney,
    BookmarkBorder,
    PeopleOutline,
    FilterList,
    KeyboardArrowDown,
    KeyboardArrowUp,
    TrendingUp,
    TrendingDown
} from '@mui/icons-material';
import { COLORS } from '@/src/theme/colors';

import { useGetDashboardStatsQuery } from '@/src/store/apis/dashboardApi';
import { useGetOrdersQuery } from '@/src/store/apis/ordersApi';

export default function DashboardPage() {
    const { data: dashboardData, isLoading: statsLoading } = useGetDashboardStatsQuery();
    const { data: orders, isLoading: ordersLoading } = useGetOrdersQuery();

    const statsCards = [
        {
            title: 'Total Revenue',
            value: `$${(dashboardData?.totalRevenue || 0).toLocaleString()}`,
            change: '+32.40%',
            isUp: true,
            icon: <AttachMoney sx={{ fontSize: '20px' }} />,
            iconBg: 'rgba(146, 136, 224, 0.2)',
            iconColor: '#9288E0'
        },
        {
            title: 'Total Dish Ordered',
            value: (dashboardData?.totalOrders || 0).toLocaleString(),
            change: '-12.40%',
            isUp: false,
            icon: <BookmarkBorder sx={{ fontSize: '20px' }} />,
            iconBg: 'rgba(255, 181, 114, 0.2)',
            iconColor: '#FFB572'
        },
        {
            title: 'Total Customer',
            value: (dashboardData?.totalCustomers || 0).toLocaleString(),
            change: '+2.40%',
            isUp: true,
            icon: <PeopleOutline sx={{ fontSize: '20px' }} />,
            iconBg: 'rgba(101, 176, 246, 0.2)',
            iconColor: '#65B0F6'
        },
    ];

    return (
        <MainLayout>
            <Box sx={{ color: '#FFF', width: '100%', maxWidth: '100vw', overflow: 'hidden' }}>
                <Grid container spacing={{ xs: 2, md: 4 }}>
                    {/* Left Column */}
                    <Grid size={{ xs: 12, lg: 8 }}>
                        {/* Header */}
                        <Box sx={{ mb: { xs: 3, md: 4 } }}>
                            <Typography variant="h1" sx={{ fontSize: { xs: '24px', md: '28px' }, mb: 0.5 }}>Dashboard</Typography>
                            <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>{new Date().toDateString()}</Typography>
                        </Box>

                        <Divider sx={{ borderBottom: `1px solid ${COLORS.divider}`, mb: { xs: 3, md: 4 } }} />

                        {/* Stats Grid */}
                        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
                            {statsCards.map((stat, index) => (
                                <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                                    <Paper sx={{
                                        p: { xs: 2, md: 3 },
                                        backgroundColor: COLORS.surface,
                                        borderRadius: '8px',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                                            <Box sx={{
                                                width: '38px',
                                                height: '38px',
                                                borderRadius: '8px',
                                                backgroundColor: stat.iconBg,
                                                color: stat.iconColor,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                {stat.icon}
                                            </Box>
                                            <Typography variant="body2" sx={{
                                                color: stat.isUp ? '#50D1AA' : '#FF7CA3',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                                {stat.change} {stat.isUp ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                                            </Typography>
                                        </Box>
                                        <Typography variant="h2" sx={{ mb: 0.5, fontSize: { xs: '20px', md: '24px' }, fontWeight: 600 }}>{stat.value}</Typography>
                                        <Typography variant="body2" sx={{ color: COLORS.text.secondary, fontSize: { xs: '12px', md: '14px' } }}>{stat.title}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Order Report */}
                        <Paper sx={{ p: { xs: 2, md: 3 }, backgroundColor: COLORS.surface, borderRadius: '8px' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                                <Typography variant="h2" sx={{ fontSize: { xs: '18px', md: '20px' } }}>Order Report</Typography>
                                <Button
                                    startIcon={<FilterList />}
                                    sx={{
                                        color: '#FFF',
                                        borderColor: COLORS.divider,
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        px: 2,
                                        fontSize: { xs: '12px', sm: '14px' }
                                    }}
                                    variant="outlined"
                                >
                                    Filter Order
                                </Button>
                            </Box>

                            <Box sx={{ overflowX: 'auto' }}>
                                <TableContainer>
                                    <Table sx={{ minWidth: 600 }}>
                                        <TableHead>
                                            <TableRow sx={{
                                                '& th': {
                                                    borderBottom: `2px solid ${COLORS.divider}`,
                                                    color: '#FFF',
                                                    fontWeight: 600,
                                                    pb: 2,
                                                    px: 1
                                                }
                                            }}>
                                                <TableCell>Customer</TableCell>
                                                <TableCell>Menu</TableCell>
                                                <TableCell>Total Payment</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orders?.slice(0, 6).map((order: any, index: number) => (
                                                <TableRow key={order._id || index} sx={{ '& td': { borderBottom: `1px solid ${COLORS.divider}`, py: 2, px: 1 } }}>
                                                    <TableCell sx={{ color: '#E0E6E9' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                            <Avatar sx={{ width: 32, height: 32, backgroundColor: COLORS.primary }}>
                                                                {order.customerName?.[0] || 'C'}
                                                            </Avatar>
                                                            <Typography variant="body2" sx={{ fontSize: '14px' }}>{order.customerName || 'Walk-in Customer'}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#E0E6E9', maxWidth: '200px' }}>
                                                        <Typography variant="body2" sx={{ fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {order.items.map((i: any) => i.product?.name).join(', ')}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#E0E6E9' }}>
                                                        <Typography variant="body2" sx={{ fontSize: '14px' }}>$ {(order.totalAmount || 0).toFixed(2)}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={order.status || 'Completed'}
                                                            size="small"
                                                            sx={{
                                                                height: '24px',
                                                                backgroundColor:
                                                                    (order.status || 'Completed') === 'Completed' ? 'rgba(80, 209, 170, 0.15)' :
                                                                        'rgba(255, 181, 114, 0.15)',
                                                                color:
                                                                    (order.status || 'Completed') === 'Completed' ? '#50D1AA' :
                                                                        '#FFB572',
                                                                fontWeight: 500,
                                                                borderRadius: '30px',
                                                                fontSize: '12px'
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right Column */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        {/* Most Ordered */}
                        <Paper sx={{ p: 3, backgroundColor: COLORS.surface, borderRadius: '8px', mb: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h2" sx={{ fontSize: '20px' }}>Most Ordered</Typography>
                                <Select size="small" defaultValue="Today" sx={{ color: '#FFF', '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.divider }, '& .MuiSelect-icon': { color: '#FFF' }, fontSize: '14px', height: '32px' }}>
                                    <MenuItem value="Today">Today</MenuItem>
                                </Select>
                            </Box>

                            <Divider sx={{ borderBottom: `1px solid ${COLORS.divider}`, mb: 3 }} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                                {(dashboardData?.mostOrdered || []).map((item: any, i: number) => (
                                    <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Avatar src={item.image} sx={{ width: 56, height: 56 }} />
                                        <Box>
                                            <Typography variant="body2" sx={{ color: '#E0E6E9', fontSize: '14px', mb: 0.5 }}>{item.name}</Typography>
                                            <Typography variant="caption" sx={{ color: COLORS.text.secondary }}>{item.count} dishes ordered</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>

                            <Button fullWidth variant="outlined" sx={{ color: COLORS.primary, borderColor: COLORS.primary, textTransform: 'none', borderRadius: '8px', py: 1, '&:hover': { borderColor: COLORS.primary, backgroundColor: 'rgba(234, 115, 109, 0.05)' } }}>
                                View All
                            </Button>
                        </Paper>

                        {/* Most Type of Order */}
                        <Paper sx={{ p: 3, backgroundColor: COLORS.surface, borderRadius: '8px', mb: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h2" sx={{ fontSize: '20px' }}>Most Type of Order</Typography>
                                <Select size="small" defaultValue="Today" sx={{ color: '#FFF', '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.divider }, '& .MuiSelect-icon': { color: '#FFF' }, fontSize: '14px', height: '32px' }}>
                                    <MenuItem value="Today">Today</MenuItem>
                                </Select>
                            </Box>

                            <Divider sx={{ borderBottom: `1px solid ${COLORS.divider}`, mb: 3 }} />

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Box sx={{ position: 'relative', width: 140, height: 140 }}>
                                    {(() => {
                                        const dist = dashboardData?.orderTypeDistribution || [];
                                        const total = dist.reduce((acc: number, item: any) => acc + (item.count || 0), 0);

                                        // radii matched with background circles
                                        const configs = [
                                            { r: 30, circ: 188.5, index: 0 }, // Inner: Dine In
                                            { r: 45, circ: 282.7, index: 1 }, // Middle: To Go
                                            { r: 60, circ: 377, index: 2 },   // Outer: Delivery
                                        ];

                                        return (
                                            <svg width="140" height="140" viewBox="0 0 140 140">
                                                {/* Background Circles */}
                                                <circle cx="70" cy="70" r="60" fill="none" stroke="#2D303E" strokeWidth="12" />
                                                <circle cx="70" cy="70" r="45" fill="none" stroke="#2D303E" strokeWidth="12" />
                                                <circle cx="70" cy="70" r="30" fill="none" stroke="#2D303E" strokeWidth="12" />

                                                {/* Data Circles */}
                                                {configs.map((config) => {
                                                    const item = dist[config.index];
                                                    const count = item?.count || 0;
                                                    const percentage = total > 0 ? count / total : 0;
                                                    const offset = config.circ * (1 - percentage);

                                                    return (
                                                        <circle
                                                            key={config.index}
                                                            cx="70"
                                                            cy="70"
                                                            r={config.r}
                                                            fill="none"
                                                            stroke={item?.color || '#333'}
                                                            strokeWidth="12"
                                                            strokeDasharray={config.circ}
                                                            strokeDashoffset={offset}
                                                            strokeLinecap="round"
                                                            transform="rotate(-90 70 70)"
                                                            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                                                        />
                                                    );
                                                })}
                                            </svg>
                                        );
                                    })()}
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {(dashboardData?.orderTypeDistribution || []).map((item: any, i: number) => (
                                        <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color || '#FF7CA3', mt: 0.75 }} />
                                            <Box>
                                                <Typography variant="body2" sx={{ color: '#FFF', fontSize: '13px', lineHeight: 1 }}>{item.type}</Typography>
                                                <Typography variant="caption" sx={{ color: COLORS.text.secondary }}>{item.count} customers</Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Paper>

                        {/* Inventory Alerts */}
                        <Paper sx={{ p: 3, backgroundColor: COLORS.surface, borderRadius: '8px' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h2" sx={{ fontSize: '20px', color: '#FF7CA3' }}>Inventory Alerts</Typography>
                                <Chip
                                    label={`${dashboardData?.lowStockMaterials || 0} Low Stock`}
                                    size="small"
                                    sx={{
                                        backgroundColor: 'rgba(255, 124, 163, 0.1)',
                                        color: '#FF7CA3',
                                        fontWeight: 600,
                                        fontSize: '12px'
                                    }}
                                />
                            </Box>

                            <Divider sx={{ borderBottom: `1px solid ${COLORS.divider}`, mb: 3 }} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {dashboardData?.lowStockDetails && dashboardData.lowStockDetails.length > 0 ? (
                                    dashboardData.lowStockDetails.map((item: any, i: number) => (
                                        <Box key={i} sx={{
                                            p: 2,
                                            borderRadius: '8px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                            borderLeft: `3px solid ${item.quantity === 0 ? '#FF7CA3' : '#FFB572'}`
                                        }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 500 }}>{item.name}</Typography>
                                                <Typography variant="caption" sx={{ color: item.quantity === 0 ? '#FF7CA3' : '#FFB572', fontWeight: 600 }}>
                                                    {item.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                                                </Typography>
                                            </Box>
                                            <Typography variant="caption" sx={{ color: COLORS.text.secondary }}>
                                                Remaining: {item.quantity} {item.unit} / Min: {item.minStockLevel} {item.unit}
                                            </Typography>
                                        </Box>
                                    ))
                                ) : (
                                    <Box sx={{ py: 4, textAlign: 'center' }}>
                                        <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>All materials are well stocked</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </MainLayout>
    );
}

