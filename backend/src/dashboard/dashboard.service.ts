import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { RawMaterial, RawMaterialDocument } from '../raw-materials/schemas/raw-material.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        @InjectModel(RawMaterial.name) private rawMaterialModel: Model<RawMaterialDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async getStats() {
        const orders = await this.orderModel.find().exec();
        const rawMaterials = await this.rawMaterialModel.find().exec();
        const products = await this.productModel.find().exec();
        const totalCustomers = await this.userModel.countDocuments({ role: 'user' }).exec();

        const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        const totalOrders = orders.length;

        const lowStockMaterials = rawMaterials.filter(
            (m) => m.quantity <= m.minStockLevel
        );

        // Calculate most ordered products
        const productSales = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const productId = item.product.toString();
                productSales[productId] = (productSales[productId] || 0) + item.quantity;
            });
        });

        const mostOrdered = Object.entries(productSales)
            .map(([id, count]) => {
                const product = products.find(p => p._id.toString() === id);
                return {
                    name: product ? product.name : 'Unknown',
                    image: product ? product.image : '',
                    count,
                };
            })
            .sort((a, b) => (b.count as number) - (a.count as number))
            .slice(0, 5);

        // Calculate real order type distribution
        const dineInCount = orders.filter(o => (o.type || 'Dine In') === 'Dine In').length;
        const toGoCount = orders.filter(o => o.type === 'To Go').length;
        const deliveryCount = orders.filter(o => o.type === 'Delivery').length;

        const orderTypeDistribution = [
            { type: 'Dine In', count: dineInCount, color: '#FF7CA3' },
            { type: 'To Go', count: toGoCount, color: '#FFB572' },
            { type: 'Delivery', count: deliveryCount, color: '#65B0F6' },
        ];

        return {
            totalRevenue,
            totalOrders,
            totalCustomers: totalCustomers || totalOrders, // Fallback if no specific customers
            lowStockMaterials: lowStockMaterials.length,
            lowStockDetails: lowStockMaterials,
            mostOrdered,
            orderTypeDistribution,
            inventoryStatus: {
                totalMaterials: rawMaterials.length,
                totalProducts: products.length,
            }
        };
    }
}
