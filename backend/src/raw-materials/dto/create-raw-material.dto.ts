import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateRawMaterialDto {
    @IsString()
    name: string;

    @IsString()
    unit: string;

    @IsNumber()
    @Min(0)
    quantity: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    minStockLevel?: number;
}
