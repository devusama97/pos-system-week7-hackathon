import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { RawMaterial } from '../../raw-materials/schemas/raw-material.schema';

export type ProductDocument = Product & Document;

@Schema()
export class RecipeItem {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'RawMaterial', required: true })
    material: RawMaterial;

    @Prop({ required: true, min: 0 })
    quantity: number;
}

const RecipeItemSchema = SchemaFactory.createForClass(RecipeItem);

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true, min: 0 })
    price: number;

    @Prop({ type: [RecipeItemSchema], required: true })
    recipe: RecipeItem[];

    @Prop({ required: true, default: 'Hot Dishes' })
    category: string;

    @Prop()
    image: string; // Cloudinary URL

    // Availability tracking
    @Prop({ default: true })
    isAvailable: boolean;

    @Prop({ type: String, default: null })
    unavailableReason: string;

    @Prop({ default: false })
    isDeleted: boolean;

    // This will be a virtual or calculated field in the service
    availableQuantity?: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
