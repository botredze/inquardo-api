import { Module } from '@nestjs/common';
import { DatabaseModule } from "./database/database.config";
import { UsersModule } from "./users/users.module";
import { ProductsModule } from './products/products.module';
import { ReferenceDataModule } from "./referenct-data/referenct-data.module";
import { ViewUserHistoryModule } from "./view-user-history/view-user-history-module";
import { BasketModule } from './basket/basket.module';
import { S3Module } from "./s3/s3.module";
import { FavoriteProductsModule } from "./favorites/favorite-products.module";
import { TempUserModule } from './temp-user/temp-user.module';
import { DadataModule } from './dadata/dadata.module';
import { ElasticsearchModuleLocal } from './elasticsearch/search.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OrderModule } from './order/order.module';


@Module({
  imports: [DatabaseModule,
    UsersModule,
    ProductsModule,
    ReferenceDataModule,
    ViewUserHistoryModule,
    BasketModule,
    S3Module,
    FavoriteProductsModule,
    TempUserModule,
    DadataModule,
    ElasticsearchModuleLocal,
    ScheduleModule.forRoot(),
    OrderModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
