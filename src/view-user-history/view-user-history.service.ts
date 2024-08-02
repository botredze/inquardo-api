import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ViewUserHistory } from '../database/models/view-user-history.model';
import { Product } from '../database/models/product.model';
import { SpBrand } from '../database/models/sp-brand.model';
import { ProductPhoto } from '../database/models/product-photo.model';
import { SpMasonry } from '../database/models/sp-masonry.model';
import { ProductStatus } from '../database/models/product-status.model';
import { spCoatingModel } from '../database/models/sp-coating.model';
import { spTextureModel } from '../database/models/sp-texture.model';
import { CollectionModel } from '../database/models/collection.model';

@Injectable()
export class ViewUserHistoryService {
  constructor(
    @InjectModel(ViewUserHistory)
    private readonly viewUserHistoryModel: typeof ViewUserHistory,
    @InjectModel(Product) private readonly productModel: typeof Product,
  ) {}

  async findUserViewHistory(userId: number): Promise<Product[]> {
    const histories = await this.viewUserHistoryModel.findAll({
      attributes: ['productId'],
      where: { userId },
      group: ['productId'],
    });

    const uniqueProductIds = histories.map(history => history.productId);

    const uniqueProducts = await this.productModel.findAll({
      where: {
        id: uniqueProductIds,
      },
      include: [
        {
          model: CollectionModel,
          attributes: ['collectionName', 'brandId'],
          include: [
            {
              model: SpBrand,
              attributes: [['brandName', 'productName']],
            }
          ],
        },
        ProductPhoto,
        spCoatingModel,
        SpMasonry,
        spTextureModel,
        ProductStatus
      ]
    });

    return uniqueProducts.map(product => product.get());
  }
}
