import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

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

    // Soft delete fields
    @Prop({ default: false })
    isDeleted: boolean;

    @Prop({ type: Date, default: null })
    deletedAt: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
    deletedBy: mongoose.Types.ObjectId;
}

export const RawMaterialSchema = SchemaFactory.createForClass(RawMaterial);
