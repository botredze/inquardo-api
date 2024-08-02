import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Product } from '../database/models/product.model';
import { ProductColor } from '../database/models/product-color.model';
import { spCoatingModel } from '../database/models/sp-coating.model';
import { SpBrand } from '../database/models/sp-brand.model';
import { ProductSize } from '../database/models/product-size.model';
import { spTextureModel } from '../database/models/sp-texture.model';
import { ProductStatus } from '../database/models/product-status.model';
import { ProductPhoto } from '../database/models/product-photo.model';
import { SpSizeRate } from '../database/models/sp-size-rate.model';
import { SpColorPalitry } from '../database/models/sp-color-palitry.model';
import { CollectionModel } from '../database/models/collection.model';

@Injectable()
export class SyncService implements OnModuleInit {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async onModuleInit() {
    await this.syncProducts();
  }

  async syncProducts() {
    const products = await this.productModel.findAll({
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
        {
          model: ProductColor,
          attributes: ["colorId"],
          include: [{ model: SpColorPalitry, attributes: ["id", "color"] }],
        },
        {
          model: ProductSize,
          attributes: ["sizeId"],
          include: [{ model: SpSizeRate, attributes: ["id", "sizeName"] }],
        },
        spCoatingModel,
        spTextureModel,
        ProductStatus,
        ProductPhoto
      ],
    });

    const body = products.flatMap(product => [
      { index: { _index: 'products', _id: product.id } },
      this.serializeProduct(product),
    ]);

    await this.elasticsearchService.bulk({ body });
  }

  serializeProduct(product: Product) {
    return {
      id: product.id,
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount,
      discountActive: product.discountActive,
      collection: product.collection ? {
        id: product.collection.id,
        name: product.collection.collectionName
      } : null,
      coating: product.coating ? {
        id: product.coating.id,
        name: product.coating.coating_name,
      } : null,
      saleType: product.saleType ? {
        id: product.saleType.id,
        name: product.saleType.type,
      } : null,
      texture: product.texture ? {
        id: product.texture.id,
        name: product.texture.texture_name,
      } : null,
      status: product.productStatus ? {
        id: product.productStatus.id,
        name: product.productStatus.status,
      } : null,
      colors: product.colors ? product.colors.map(color => ({
        id: color.id,
        color: color.color ? color.color.color : null,
      })) : [],
      sizes: product.sizes ? product.sizes.map(size => ({
        id: size.id,
        sizeId: size.sizeId,
        sizeName: size.size ? size.size.sizeName : null,
      })) : [],
      photos: product.photos ? product.photos.map(photo => ({
        id: photo.id,
        url: photo.url,
      })) : [],
    };
  }

}
