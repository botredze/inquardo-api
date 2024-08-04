import { IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class PriceDto {
  min?: number;
  max?: number;
}
export class ProductFilterDto {
  coating?: number[];
  color?: number[];
  kladka?: number[];
  price?: PriceDto;
  size?: number;
  status?: number[];
  texture?: number[];s
  sorting?: number;
  brandId: number;
}
