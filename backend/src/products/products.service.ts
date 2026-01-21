import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RawMaterial, RawMaterialDocument } from '../raw-materials/schemas/raw-material.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name)
        private productModel: Model<ProductDocument>,
        @InjectModel(RawMaterial.name)
        private rawMaterialModel: Model<RawMaterialDocument>,
        private cloudinaryService: CloudinaryService,
    ) { }

    async create(createProductDto: CreateProductDto, imageFile?: Express.Multer.File): Promise<Product> {
        try {
            let imageUrl = '';
            if (imageFile) {
                const uploadResult = await this.cloudinaryService.uploadImage(imageFile);
                imageUrl = uploadResult.secure_url;
            }

            const createdProduct = new this.productModel({
                ...createProductDto,
                image: imageUrl,
            });
            return await createdProduct.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('Product with this name already exists');
            }
            throw error;
        }
    }

    async findAll(): Promise<Product[]> {
        // Only return non-deleted products
        const products = await this.productModel
            .find({ isDeleted: false })
            .populate('recipe.material')
            .exec();

        // Get only non-deleted materials
        const rawMaterials = await this.rawMaterialModel
            .find({ isDeleted: false })
            .exec();

        return products.map(product => {
            const productObj = product.toObject();
            productObj.availableQuantity = this.calculateAvailability(product, rawMaterials);
            return productObj;
        });
    }

    async findOne(id: string): Promise<any> {
        const product = await this.productModel
            .findOne({ _id: id, isDeleted: false })
            .populate('recipe.material')
            .exec();

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        const rawMaterials = await this.rawMaterialModel
            .find({ isDeleted: false })
            .exec();

        const productObj = product.toObject();
        productObj.availableQuantity = this.calculateAvailability(product, rawMaterials);

        return productObj;
    }

    async update(id: string, updateProductDto: UpdateProductDto, imageFile?: Express.Multer.File): Promise<Product> {
        let updateData: any = { ...updateProductDto };

        if (imageFile) {
            const uploadResult = await this.cloudinaryService.uploadImage(imageFile);
            updateData.image = uploadResult.secure_url;
        }

        const updatedProduct = await this.productModel
            .findOneAndUpdate(
                { _id: id, isDeleted: false },
                updateData,
                { new: true }
            )
            .exec();

        if (!updatedProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return updatedProduct;
    }

    async remove(id: string): Promise<any> {
        // Soft delete for products too
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        product.isDeleted = true;
        await product.save();

        return {
            success: true,
            message: 'Product deleted successfully'
        };
    }

    private calculateAvailability(product: any, rawMaterials: RawMaterialDocument[]): number {
        let minAvailability = Infinity;

        for (const item of product.recipe) {
            const materialId = item.material._id ? item.material._id.toString() : item.material.toString();
            const material = rawMaterials.find(m => m._id.toString() === materialId);

            // Check if material exists and is not deleted
            if (!material || material.isDeleted) {
                return 0; // Material missing or deleted, product cannot be made
            }

            const possibleUnits = Math.floor(material.quantity / item.quantity);
            if (possibleUnits < minAvailability) {
                minAvailability = possibleUnits;
            }
        }

        return minAvailability === Infinity ? 0 : minAvailability;
    }

    // New method to check product availability with detailed info
    async checkAvailability(productId: string): Promise<{
        available: boolean;
        reason?: string;
        maxQuantity?: number;
        missingMaterials?: string[];
    }> {
        const product = await this.productModel
            .findOne({ _id: productId, isDeleted: false })
            .populate('recipe.material')
            .exec();

        if (!product) {
            return { available: false, reason: 'Product not found' };
        }

        if (!product.isAvailable) {
            return {
                available: false,
                reason: product.unavailableReason || 'Product unavailable'
            };
        }

        const missingMaterials: string[] = [];
        let minQuantity = Infinity;

        for (const item of product.recipe) {
            const material = item.material as any;

            if (!material || material.isDeleted) {
                missingMaterials.push(material?.name || 'Unknown material');
                continue;
            }

            const possibleUnits = Math.floor(material.quantity / item.quantity);
            if (possibleUnits < minQuantity) {
                minQuantity = possibleUnits;
            }
        }

        if (missingMaterials.length > 0) {
            return {
                available: false,
                reason: `Missing ingredients: ${missingMaterials.join(', ')}`,
                missingMaterials
            };
        }

        if (minQuantity === 0) {
            return {
                available: false,
                reason: 'Insufficient ingredients'
            };
        }

        return {
            available: true,
            maxQuantity: minQuantity === Infinity ? 0 : minQuantity
        };
    }
}
