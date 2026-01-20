import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';

export type OrderDocument = Order & Document;

@Schema()
export class OrderItem {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
    product: Product;

    @Prop({ required: true, min: 1 })
    quantity: number;

    @Prop({ required: true })
    priceAtTimeOfSale: number;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: [OrderItemSchema], required: true })
    items: OrderItem[];

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ default: 'completed' })
    status: string; // 'completed', 'cancelled'

    @Prop({ default: 'Dine In' })
    type: string; // 'Dine In', 'To Go', 'Delivery'
}

export const OrderSchema = SchemaFactory.createForClass(Order);
