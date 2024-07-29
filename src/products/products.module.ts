import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from "../database/models/product.model";
import { Category } from "../database/models/category.model";
import { ProductColor } from "../database/models/product-color.model";
import { ProductSize } from "../database/models/product-size.model";
import { ProductRecommendation } from "../database/models/product-recommendations.model";
import { ProductDetails } from "../database/models/product-details.model";
import { ProductPhoto } from "../database/models/product-photo.model";
import { S3Module } from "../s3/s3.module";
import { Rating } from "../database/models/rating.model";
import { SpMasonry } from '../database/models/sp-masonry.model';
import { spCoatingModel } from '../database/models/sp-coating.model';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ViewUserHistory } from '../database/models/view-user-history.model';


@Module({
  imports: [
    SequelizeModule.forFeature([
      Product,
      Category,
      ProductColor,
      ProductSize,
      ProductRecommendation,
      ProductDetails,
      ProductPhoto,
      Rating,
      SpMasonry,
      spCoatingModel,
      ViewUserHistory
    ]),
    PassportModule,
    JwtModule.register({
      secret: 'Afina954120',
    }),

    S3Module
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
