import { IsString, IsNumber, IsArray, ValidateNested, Min, IsMongoId, IsOptional } from 'class-validator';
import { Type, Transform, plainToInstance } from 'class-transformer';

export class RecipeItemDto {
    @IsMongoId()
    material: string;

    @IsNumber()
    @Min(0)
    quantity: number;
}

export class CreateProductDto {
    @IsString()
    name: string;

    @IsNumber()
    @Min(0)
    @Transform(({ value }) => Number(value))
    price: number;

    @IsString()
    category: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RecipeItemDto)
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    return parsed.map(item => plainToInstance(RecipeItemDto, item));
                }
                return parsed;
            } catch (e) {
                return value;
            }
        }
        if (Array.isArray(value)) {
            return value.map(item => plainToInstance(RecipeItemDto, item));
        }
        return value;
    })
    recipe: RecipeItemDto[];
}
