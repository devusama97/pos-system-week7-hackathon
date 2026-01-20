import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { RawMaterial, RawMaterialDocument } from '../raw-materials/schemas/raw-material.schema';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name)
        private orderModel: Model<OrderDocument>,
        @InjectModel(Product.name)
        private productModel: Model<ProductDocument>,
        @InjectModel(RawMaterial.name)
        private rawMaterialModel: Model<RawMaterialDocument>,
        @InjectConnection() private readonly connection: Connection,
    ) { }

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            let totalAmount = 0;
            const orderItems: any[] = [];

            for (const item of createOrderDto.items) {
                const product = await this.productModel.findById(item.product).populate('recipe.material').session(session).exec();
                if (!product) {
                    throw new NotFoundException(`Product with ID ${item.product} not found`);
                }

                // 1. Check if sufficient raw materials exist
                for (const recipeItem of product.recipe) {
                    const material = await this.rawMaterialModel.findById(recipeItem.material).session(session).exec();
                    const requiredQuantity = recipeItem.quantity * item.quantity;

                    if (!material || material.quantity < requiredQuantity) {
                        throw new BadRequestException(
                            `Insufficient stock for raw material: ${material ? material.name : 'Unknown'}. Required: ${requiredQuantity}, Available: ${material ? material.quantity : 0}`
                        );
                    }

                    // 2. Deduct raw material stock
                    material.quantity -= requiredQuantity;
                    await material.save({ session });
                }

                totalAmount += product.price * item.quantity;
                orderItems.push({
                    product: product._id,
                    quantity: item.quantity,
                    priceAtTimeOfSale: product.price,
                });
            }

            const createdOrder = new this.orderModel({
                items: orderItems,
                totalAmount,
                type: createOrderDto.type || 'Dine In',
            });

            const savedOrder = await createdOrder.save({ session });
            await session.commitTransaction();
            return savedOrder;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async findAll(): Promise<Order[]> {
        return await this.orderModel.find().populate('items.product').exec();
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.orderModel.findById(id).populate('items.product').exec();
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
}
