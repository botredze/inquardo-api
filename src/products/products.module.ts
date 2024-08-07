import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from "../database/models/product.model";
import { ProductColor } from "../database/models/product-color.model";
import { ProductSize } from "../database/models/product-size.model";
import { ProductRecommendation } from "../database/models/product-recommendations.model";
import { ProductPhoto } from "../database/models/product-photo.model";
import { S3Module } from "../s3/s3.module";
import { Rating } from "../database/models/rating.model";
import { SpMasonry } from '../database/models/sp-masonry.model';
import { spCoatingModel } from '../database/models/sp-coating.model';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ViewUserHistory } from '../database/models/view-user-history.model';
import { spTextureModel } from '../database/models/sp-texture.model';
import { ProductStatus } from '../database/models/product-status.model';
import { CollectionModel } from '../database/models/collection.model';
import { SpSaleTypeModel } from 'src/database/models/sp-sale-type.model';
import { SpColorPalitry } from 'src/database/models/sp-color-palitry.model';
import { SpSizeRate } from 'src/database/models/sp-size-rate.model';
import { SpFactureModel } from 'src/database/models/sp_facture.model';
import { ProductMasonry } from '../database/models/product-masonty.model';


@Module({
  imports: [
    SequelizeModule.forFeature([
      Product,
      ProductColor,
      ProductSize,
      ProductRecommendation,
      ProductPhoto,
      Rating,
      SpMasonry,
      spCoatingModel,
      ViewUserHistory,
      spTextureModel,
      ProductStatus,
      CollectionModel,
      SpSaleTypeModel,
      SpColorPalitry,
      SpSizeRate,
      SpFactureModel,
      ProductMasonry
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
