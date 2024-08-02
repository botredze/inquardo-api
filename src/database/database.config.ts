import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { Product } from "./models/product.model";
import { SpBrand } from "./models/sp-brand.model";
import { Rating } from "./models/rating.model";
import { SpColorPalitry } from "./models/sp-color-palitry.model";
import { SpSizeRate } from "./models/sp-size-rate.model";
import { Address } from "./models/address.model";
import { UserDetails } from "./models/user-details.model";
import { User } from "./models/user.model";
import { Basket } from "./models/basket.model";
import { BasketItem } from "./models/basket-item.model";
import { ViewUserHistory } from "./models/view-user-history.model";
import { ProductRecommendation } from "./models/product-recommendations.model";
import { ProductSize } from "./models/product-size.model";
import { ProductColor } from "./models/product-color.model";
import { ProductPhoto } from "./models/product-photo.model";
import { FavoriteProduct } from "./models/favorite.model";
import { spCoatingModel } from './models/sp-coating.model';
import { SpMasonry } from './models/sp-masonry.model';
import { SpSaleTypeModel } from './models/sp-sale-type.model';
import { spTextureModel } from './models/sp-texture.model';
import { ProductStatus } from './models/product-status.model';
import { CollectionModel } from './models/collection.model';
import { Order } from './models/order.model';
import { OrderItem } from './models/order-item.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      dialectOptions: {
        ssl: {
          rejectUnauthorized: true,
          ca: fs.readFileSync(path.resolve(__dirname, '..', '..', 'ca-certificate.crt')).toString(),
        },
      },
      // autoLoadModels: true,
      // synchronize: true,
      models: [Product,
        CollectionModel,
        SpBrand,
        Rating,
        SpColorPalitry,
        SpSizeRate,
        Address,
        UserDetails,
        User,
        Basket,
        BasketItem,
        ViewUserHistory,
        ProductRecommendation,
        ProductSize,
        ProductColor,
        ProductPhoto,
        FavoriteProduct,
        spCoatingModel,
        SpMasonry,
        SpSaleTypeModel,
        spTextureModel,
        ProductStatus,
        Order,
        OrderItem
      ],
    }),
  ],
})
export class DatabaseModule {}
