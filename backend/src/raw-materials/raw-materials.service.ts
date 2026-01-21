import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RawMaterial, RawMaterialDocument } from './schemas/raw-material.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';

@Injectable()
export class RawMaterialsService {
    constructor(
        @InjectModel(RawMaterial.name)
        private rawMaterialModel: Model<RawMaterialDocument>,
        @InjectModel(Product.name)
        private productModel: Model<ProductDocument>,
    ) { }

    async create(createRawMaterialDto: CreateRawMaterialDto): Promise<RawMaterial> {
        try {
            const createdRawMaterial = new this.rawMaterialModel(createRawMaterialDto);
            return await createdRawMaterial.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('Raw material with this name already exists');
            }
            throw error;
        }
    }

    async findAll(): Promise<RawMaterial[]> {
        // Only return non-deleted materials
        return await this.rawMaterialModel.find({ isDeleted: false }).exec();
    }

    async findOne(id: string): Promise<RawMaterial> {
        const rawMaterial = await this.rawMaterialModel.findOne({
            _id: id,
            isDeleted: false
        }).exec();
        if (!rawMaterial) {
            throw new NotFoundException(`Raw material with ID ${id} not found`);
        }
        return rawMaterial;
    }

    async update(id: string, updateRawMaterialDto: UpdateRawMaterialDto): Promise<RawMaterial> {
        const updatedRawMaterial = await this.rawMaterialModel
            .findOneAndUpdate(
                { _id: id, isDeleted: false },
                updateRawMaterialDto,
                { new: true }
            )
            .exec();
        if (!updatedRawMaterial) {
            throw new NotFoundException(`Raw material with ID ${id} not found`);
        }
        return updatedRawMaterial;
    }

    async remove(id: string, userId?: string): Promise<any> {
        // Step 1: Find the material
        const material = await this.rawMaterialModel.findById(id).exec();
        if (!material) {
            throw new NotFoundException(`Raw material with ID ${id} not found`);
        }

        if (material.isDeleted) {
            throw new BadRequestException('Raw material is already deleted');
        }

        // Step 2: Check for dependent products
        const dependentProducts = await this.productModel.find({
            'recipe.material': id as any,
            isDeleted: false
        } as any).exec();

        // Step 3: Soft delete the material
        material.isDeleted = true;
        material.deletedAt = new Date();
        if (userId) {
            material.deletedBy = userId as any;
        }
        await material.save();

        // Step 4: Mark dependent products as unavailable
        if (dependentProducts.length > 0) {
            await this.productModel.updateMany(
                { 'recipe.material': id as any } as any,
                {
                    $set: {
                        isAvailable: false,
                        unavailableReason: `Missing ingredient: ${material.name}`
                    }
                }
            ).exec();

            return {
                success: true,
                message: 'Raw material deleted successfully',
                affectedProducts: dependentProducts.length,
                affectedProductNames: dependentProducts.map(p => p.name),
                warning: 'Dependent products have been marked as unavailable'
            };
        }

        return {
            success: true,
            message: 'Raw material deleted successfully',
            affectedProducts: 0
        };
    }

    // Helper method to check if a material can be safely deleted
    async checkDependencies(id: string): Promise<{
        canDelete: boolean;
        dependentProducts: string[];
        activeInCarts: boolean;
    }> {
        const dependentProducts = await this.productModel.find({
            'recipe.material': id as any,
            isDeleted: false
        } as any).select('name').exec();

        return {
            canDelete: true, // We allow deletion but mark products unavailable
            dependentProducts: dependentProducts.map(p => p.name),
            activeInCarts: false // TODO: Implement cart checking when cart module is ready
        };
    }
}
