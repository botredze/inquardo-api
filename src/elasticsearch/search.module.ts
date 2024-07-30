import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SyncService } from './sync.service';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductColor } from '../database/models/product-color.model';
import { spCoatingModel } from '../database/models/sp-coating.model';
import { ProductSize } from '../database/models/product-size.model';
import { ProductPhoto } from '../database/models/product-photo.model';
import { Product } from '../database/models/product.model';
import { ProductRecommendation } from '../database/models/product-recommendations.model';
import { Rating } from '../database/models/rating.model';
import { SpMasonry } from '../database/models/sp-masonry.model';
import { ViewUserHistory } from '../database/models/view-user-history.model';
import { SpColorPalitry } from '../database/models/sp-color-palitry.model';
import { SpSizeRate } from '../database/models/sp-size-rate.model';
import { CollectionModel } from '../database/models/collection.model';

@Module({
  imports: [
    ConfigModule,
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
      SpColorPalitry,
      SpSizeRate,
      CollectionModel
    ]),
    ElasticsearchModule.registerAsync({ imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SearchService,
    //SyncService
  ],
  controllers: [SearchController],
  exports: [ElasticsearchModule],
})
export class ElasticsearchModuleLocal {}
