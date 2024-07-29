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

@Module({
  imports: [
    SequelizeModule.forFeature([Basket, BasketItem, ProductColor, ProductSize]),
    PassportModule,
    JwtModule.register({
      secret: 'Afina954120',
    }),
  ],

  providers: [BasketService],
  controllers: [BasketController]
})
export class BasketModule {}
