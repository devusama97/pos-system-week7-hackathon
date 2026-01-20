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
        const products = await this.productModel.find().populate('recipe.material').exec();
        const rawMaterials = await this.rawMaterialModel.find().exec();

        return products.map(product => {
            const productObj = product.toObject();
            productObj.availableQuantity = this.calculateAvailability(product, rawMaterials);
            return productObj;
        });
    }

    async findOne(id: string): Promise<any> {
        const product = await this.productModel.findById(id).populate('recipe.material').exec();
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        const rawMaterials = await this.rawMaterialModel.find().exec();
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
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();

        if (!updatedProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return updatedProduct;
    }

    async remove(id: string): Promise<any> {
        const result = await this.productModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return result;
    }

    private calculateAvailability(product: any, rawMaterials: RawMaterialDocument[]): number {
        let minAvailability = Infinity;

        for (const item of product.recipe) {
            const materialId = item.material._id ? item.material._id.toString() : item.material.toString();
            const material = rawMaterials.find(m => m._id.toString() === materialId);

            if (!material) {
                return 0; // Material missing, product cannot be made
            }

            const possibleUnits = Math.floor(material.quantity / item.quantity);
            if (possibleUnits < minAvailability) {
                minAvailability = possibleUnits;
            }
        }

        return minAvailability === Infinity ? 0 : minAvailability;
    }
}
