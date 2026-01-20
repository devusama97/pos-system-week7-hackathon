import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RawMaterial, RawMaterialDocument } from './schemas/raw-material.schema';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';

@Injectable()
export class RawMaterialsService {
    constructor(
        @InjectModel(RawMaterial.name)
        private rawMaterialModel: Model<RawMaterialDocument>,
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
        return await this.rawMaterialModel.find().exec();
    }

    async findOne(id: string): Promise<RawMaterial> {
        const rawMaterial = await this.rawMaterialModel.findById(id).exec();
        if (!rawMaterial) {
            throw new NotFoundException(`Raw material with ID ${id} not found`);
        }
        return rawMaterial;
    }

    async update(id: string, updateRawMaterialDto: UpdateRawMaterialDto): Promise<RawMaterial> {
        const updatedRawMaterial = await this.rawMaterialModel
            .findByIdAndUpdate(id, updateRawMaterialDto, { new: true })
            .exec();
        if (!updatedRawMaterial) {
            throw new NotFoundException(`Raw material with ID ${id} not found`);
        }
        return updatedRawMaterial;
    }

    async remove(id: string): Promise<any> {
        const result = await this.rawMaterialModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Raw material with ID ${id} not found`);
        }
        return result;
    }
}
