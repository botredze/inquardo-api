import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { SequelizeModule } from "@nestjs/sequelize";
import { BasketItem } from "../database/models/basket-item.model";
import { Basket } from "../database/models/basket.model";
import { ProductColor } from "../database/models/product-color.model";
import { ProductSize } from "../database/models/product-size.model";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Product } from '../database/models/product.model';
import { SpBrand } from '../database/models/sp-brand.model';
import { SpColorPalitry } from 'src/database/models/sp-color-palitry.model';
import { SpSizeRate } from 'src/database/models/sp-size-rate.model';
import { ProductPhoto } from 'src/database/models/product-photo.model';
import { SpSaleTypeModel } from 'src/database/models/sp-sale-type.model';
import { CollectionModel } from 'src/database/models/collection.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Basket, 
      BasketItem,
       ProductColor,
        ProductSize,
         Product,
         SpBrand,
         SpColorPalitry,
         SpSizeRate, 
         ProductPhoto,
         SpSaleTypeModel,
         CollectionModel
        ]),
    PassportModule,
    JwtModule.register({
      secret: 'Afina954120',
    }),
  ],

  providers: [BasketService],
  controllers: [BasketController]
})
export class BasketModule {}
