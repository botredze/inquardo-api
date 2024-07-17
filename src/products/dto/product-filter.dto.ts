import { IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductFilterDto {
  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  sizeId?: number;

  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  @IsArray()
  colorIds?: number[];

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  priceMin?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  priceMax?: number;

  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  @IsArray()
  collectionIds?: number[];

  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  @IsArray()
  masonryTypes?: number[];

  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  @IsArray()
  coatings?: number[];

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  sorting?: number;
}
