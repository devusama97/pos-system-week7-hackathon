import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RawMaterialsService } from './raw-materials.service';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('raw-materials')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class RawMaterialsController {
    constructor(private readonly rawMaterialsService: RawMaterialsService) { }

    @Post()
    create(@Body() createRawMaterialDto: CreateRawMaterialDto) {
        return this.rawMaterialsService.create(createRawMaterialDto);
    }

    @Get()
    findAll() {
        return this.rawMaterialsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rawMaterialsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRawMaterialDto: UpdateRawMaterialDto) {
        return this.rawMaterialsService.update(id, updateRawMaterialDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.rawMaterialsService.remove(id);
    }
}
