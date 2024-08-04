import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProductItemDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly status: string;

  @IsString()
  readonly mansory: string;

  @IsString()
  readonly coating: string;

  @IsString()
  readonly texture: string;

  @IsString()
  readonly facture: string;

  @IsString()
  readonly size: string;

  @IsString()
  readonly color: string;

  @IsString()
  readonly country: string;

  @IsString()
  readonly price: string;

  @IsString()
  readonly type: string;

  @IsString()
  readonly komplect: string;

  @IsString()
  readonly articles: string;
}

export class CreateProductsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  readonly data: ProductItemDto[];

  @IsNumber()
  readonly brandId: number;
}
