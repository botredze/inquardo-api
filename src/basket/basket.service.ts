import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Basket } from "../database/models/basket.model";
import { BasketItem } from "../database/models/basket-item.model";
import { InjectModel } from "@nestjs/sequelize";
import { JwtService } from '@nestjs/jwt';
import { Product } from '../database/models/product.model';
import { ProductColor } from '../database/models/product-color.model';
import { ProductSize } from '../database/models/product-size.model';
import { SpBrand } from '../database/models/sp-brand.model';
import { SpColorPalitry } from 'src/database/models/sp-color-palitry.model';
import { SpSizeRate } from 'src/database/models/sp-size-rate.model';
import { ProductPhoto } from 'src/database/models/product-photo.model';
import { SpSaleTypeModel } from 'src/database/models/sp-sale-type.model';
import { CollectionModel } from 'src/database/models/collection.model';
import { ProductStatus } from '../database/models/product-status.model';
import { FavoriteProduct } from '../database/models/favorite.model';

@Injectable()
export class BasketService {
  constructor(
    @InjectModel(Basket) private basketModel: typeof Basket,
    @InjectModel(BasketItem) private basketItemModel: typeof BasketItem,
    private readonly jwtService: JwtService,
  ) {}

  async addItemToBasket( userId: number ,product): Promise<number> {
    const {id} = product;
    const productId = id
    try {
      let basket = await this.basketModel.findOne({ where: { userId } });

      if (!basket) {
        basket = await this.basketModel.create({ userId });
      }

      const basketItem = await this.basketItemModel.create({ basketId: basket.id, productId, colorId: productId, sizeId: productId, count: 1 });

      return basketItem.id;
    } catch (error) {
      console.error('Error adding item to basket:', error);
      throw new InternalServerErrorException('Error adding item to basket');
    }
  }

  async getUserBasket(userId: number): Promise<any> {
    try {
      const basket = await this.basketModel.findOne({
        where: { userId },
        attributes: ['id', 'userId'],
        include: [
          {
            model: BasketItem,
            include: [
              {
                model: Product,
                include: [
                  {
                    model: CollectionModel,
                    attributes: ['collectionName', 'brandId'],
                    include: [
                      {
                        model: SpBrand,
                        attributes: ['brandName'],
                      },
                    ],
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
                  {
                    model: ProductStatus,
                    attributes: ['id', 'status'],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (basket) {
        const basketItems = await Promise.all(
          basket.items.map(async (item) => {
            const product = item.product;

            console.log(  product.collection.brand, '  product.collection.brand.');
            return {
              id: item.id,
              productId: item.productId,
              price: product.price,
              oldPrice: product.oldPrice,
              discount: product.discount,
              discountActive: product.discountActive,
              material: product.material,
              country: product.country,
              articul: product.articul,
              complect: product.complect,
              collectionId: product.collectionId,
              brandId: product.brandId,
              coatingId: product.coatingId,
              saleTypeId: product.saleTypeId,
              factureId: product.factureId,
              textureId: product.textureId,
              statusId: product.statusId,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
              count: item.count,
              productStatus: {
                status: product.productStatus.status,
              },
              collection: {
                collectionName: product.collection.collectionName,
                brand: {
                  productName: product.collection.brand.brandName
                },
              },
              colors: product.colors.map((color) => ({
                id: color.colorId,
                color: color.color.color,
              })),
              sizes: product.sizes.map((size) => ({
                id: size.sizeId,
                sizeName: size.size.sizeName,
              })),
              photos: product.photos.map((photo) => ({
                id: photo.id,
                productId: photo.productId,
                url: photo.url,
                main: photo.main,
                interier: photo.interier,
                createdAt: photo.createdAt,
                updatedAt: photo.updatedAt,
              })),
              saleType: product.saleType
                ? { id: product.saleType.id, type: product.saleType.type }
                : null,
            };
          })
        );

        return basketItems;
      }

      return null;
    } catch (error) {
      console.error('Error getting user basket:', error);
      throw new InternalServerErrorException('Error getting user basket');
    }
  }

  async removeItemFromBasket(userId: number, itemId: number): Promise<void> {
    try {
      const basket = await this.basketModel.findOne({ where: { userId } });

      if (!basket) {
        throw new NotFoundException('Basket not found');
      }

      const basketItem = await this.basketItemModel.findOne({ where: { id: itemId, basketId: basket.id } });

      if (!basketItem) {
        throw new NotFoundException('Basket item not found');
      }

      await basketItem.destroy();
    } catch (error) {
      console.error('Error removing item from basket:', error);
      throw new InternalServerErrorException('Error removing item from basket');
    }
  }

  decodeUserIdFromToken(authHeader: string): number {
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.decode(token) as { sub: number };
    return decodedToken.sub;
  }

  async updateBasketCount(userId: number, productId: number, typeCounter: number) {
    const basket = await this.basketModel.findOne({
      where: { userId },
      include: [{ model: BasketItem, where: { productId } }],
    });
    if (!basket) {
      throw new NotFoundException('Basket not found for the user');
    }

    let basketItem = basket.items.find(item => item.productId === productId);

    if (!basketItem) {
      throw new NotFoundException('Product not found in basket');
    }

    basketItem.count = typeCounter === 1 ? basketItem.count + 1 : basketItem.count - 1;

    await basketItem.save();

    return basket;
  }

}
