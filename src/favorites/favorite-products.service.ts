import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../database/models/product.model';
import { FavoriteProduct } from "../database/models/favorite.model";
import { JwtService } from '@nestjs/jwt';
import { SpSaleTypeModel } from '../database/models/sp-sale-type.model';
import { ProductPhoto } from '../database/models/product-photo.model';
import { SpSizeRate } from '../database/models/sp-size-rate.model';
import { ProductSize } from '../database/models/product-size.model';
import { SpColorPalitry } from '../database/models/sp-color-palitry.model';
import { ProductColor } from '../database/models/product-color.model';
import { SpBrand } from '../database/models/sp-brand.model';
import { CollectionModel } from '../database/models/collection.model';

@Injectable()
export class FavoriteProductsService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    @InjectModel(FavoriteProduct) private favoriteProductModel: typeof FavoriteProduct,
    private readonly jwtService: JwtService,
  ) {}

  async addToFavorites(userId: number, productId: number, colorId: number, sizeId: number, count: number) {
    try {
      const fav = await this.favoriteProductModel.create({ userId, productId, colorId, sizeId, count })
      return { sub: fav.id };
    } catch (error) {
      console.log(error);
      throw new Error('Failed to add to favorites');
    }
  }

  async removeFromFavorites(userId: number, productId: number): Promise<void> {
    await this.favoriteProductModel.destroy({ where: { userId, productId } });
  }

  async findOne(id: number): Promise<any> {
    const product = await this.productModel.findByPk(id, {
      include: [
        {
          model: CollectionModel,
          attributes: ['collectionName', 'brandId'],
          include: [
            {
              model: SpBrand,
              attributes: [['brandName', 'productName']],
            }
          ]
        },
        {
          model: ProductColor,
          attributes: ['colorId'],
          include: [{ model: SpColorPalitry, attributes: ['id', 'color'] }],
        },
        {
          model: ProductSize,
          attributes: ['sizeId'],
          include: [{ model: SpSizeRate, attributes: ['id', 'sizeName'] }],
        },
        ProductPhoto,
        {
          model: SpSaleTypeModel,
          attributes: ['id', 'type'],
        },
      ],
    });

    if (product) {
      return {
        ...product.get(),
        colors: product.colors.map((color) => ({
          id: color.colorId,
          color: color.color.color,
        })),
        collection: {
          ...product.collection.get(),
          brandName: product.collection.brand.brandName
        },
        sizes: product.sizes.map((size) => ({
          id: size.sizeId,
          sizeName: size.size.sizeName,
        })),
        saleType: product.saleType
          ? { id: product.saleType.id, type: product.saleType.type }
          : null,
      };
    }

    return null;
  }

  async getFavoritesByUserId(userId: number): Promise<any[]> {
    const favoriteProducts = await this.favoriteProductModel.findAll({
      where: { userId },
      include: [Product],
    });

    const detailedProducts = await Promise.all(
      favoriteProducts.map(async (fp) => {
        const detailedProduct = await this.findOne(fp.productId);
        return {
          ...detailedProduct,
            id: fp.id,
            userId: fp.userId,
            productId: fp.productId,
            colorId: fp.colorId,
            sizeId: fp.sizeId,
            count: fp.count,
            createdAt: fp.createdAt,
            updatedAt: fp.updatedAt,
        };
      }),
    );

    return detailedProducts;
  }

  decodeUserIdFromToken(authHeader: string): number {
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.decode(token) as { sub: number };
    return decodedToken.sub;
  }
}
