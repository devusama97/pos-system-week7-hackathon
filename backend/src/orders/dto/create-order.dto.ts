import { IsArray, ValidateNested, IsString, IsOptional, IsMongoId, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
    @IsMongoId()
    product: string;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsString()
    @IsOptional()
    type?: string;

    @IsString()
    @IsOptional()
    paymentMethod?: string;
}
