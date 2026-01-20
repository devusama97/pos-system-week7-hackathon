import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RawMaterialDocument = RawMaterial & Document;

@Schema({ timestamps: true })
export class RawMaterial {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    unit: string; // e.g., 'g', 'ml', 'pcs'

    @Prop({ required: true, default: 0 })
    quantity: number;

    @Prop({ default: 0 })
    minStockLevel: number;
}

export const RawMaterialSchema = SchemaFactory.createForClass(RawMaterial);
