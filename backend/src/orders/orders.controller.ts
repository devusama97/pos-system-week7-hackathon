import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(createOrderDto);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('admin')
    findAll() {
        return this.ordersService.findAll();
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }
}
