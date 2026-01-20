import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { RawMaterialsModule } from '../raw-materials/raw-materials.module';
import { ProductsModule } from '../products/products.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    OrdersModule,
    ProductsModule,
    RawMaterialsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
