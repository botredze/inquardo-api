import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ViewUserHistory } from '../database/models/view-user-history.model';
import { User } from '../database/models/user.model';
import { Product } from '../database/models/product.model';
import { ViewUserHistoryService } from './view-user-history.service';
import { ViewUserHistoryController } from './view-user-history.controller';
import { JwtModule } from '@nestjs/jwt';
import { Category } from '../database/models/category.model';
import { ProductColor } from '../database/models/product-color.model';
import { ProductSize } from '../database/models/product-size.model';
import { ProductRecommendation } from '../database/models/product-recommendations.model';
import { ProductDetails } from '../database/models/product-details.model';
import { ProductPhoto } from '../database/models/product-photo.model';
import { Rating } from '../database/models/rating.model';
import { SpMasonry } from '../database/models/sp-masonry.model';
import { spCoatingModel } from '../database/models/sp-coating.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Product,
      Category,
      ProductColor,
      ProductSize,
      ProductRecommendation,
      ProductDetails,
      ProductPhoto,
      Rating,
      SpMasonry,
      spCoatingModel,
      ViewUserHistory]),
    JwtModule.register({
      secret: 'Afina954120',
    }),
  ],
  providers: [ViewUserHistoryService],
  controllers: [ViewUserHistoryController],
})
export class ViewUserHistoryModule {}
