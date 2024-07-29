import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FavoriteProductsService } from './favorite-products.service';
import { FavoriteProductsController } from './favorite-products.controller';
import { User } from "../database/models/user.model";
import { Product } from "../database/models/product.model";
import { FavoriteProduct } from "../database/models/favorite.model";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([User, Product, FavoriteProduct]),
    PassportModule,
    JwtModule.register({
      secret: 'Afina954120',
    }),],
  providers: [FavoriteProductsService],
  controllers: [FavoriteProductsController],
})
export class FavoriteProductsModule {}
