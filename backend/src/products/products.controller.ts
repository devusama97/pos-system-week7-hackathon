import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('products')
// @UseGuards(JwtAuthGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    // @UseGuards(RolesGuard)
    // @Roles('admin')
    @UseInterceptors(FileInterceptor('image'))
    create(
        @Body() createProductDto: CreateProductDto,
        @UploadedFile() image?: Express.Multer.File,
    ) {
        return this.productsService.create(createProductDto, image);
    }

    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    // @UseGuards(RolesGuard)
    // @Roles('admin')
    @UseInterceptors(FileInterceptor('image'))
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFile() image?: Express.Multer.File,
    ) {
        return this.productsService.update(id, updateProductDto, image);
    }

    @Delete(':id')
    // @UseGuards(RolesGuard)
    // @Roles('admin')
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
