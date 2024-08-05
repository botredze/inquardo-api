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

@Injectable()
export class BasketService {
  constructor(
    @InjectModel(Basket) private basketModel: typeof Basket,
    @InjectModel(BasketItem) private basketItemModel: typeof BasketItem,
    private readonly jwtService: JwtService,
  ) {}

  async addItemToBasket(userId: number, productId: number, colorId: number, sizeId: number, count: number): Promise<number> {
    try {
      let basket = await this.basketModel.findOne({ where: { userId } });

      if (!basket) {
        basket = await this.basketModel.create({ userId });
      }

      const basketItem = await this.basketItemModel.create({ basketId: basket.id, productId, colorId: productId, sizeId: productId, count });
      
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
              },
            ],
          },
        ],
      });

      if (basket) {
        const basketItems = await Promise.all(
          basket.items.map(async (item) => {
            const product = item.product;

            return {
              ...item.get(),
              product: {
                ...product.get(),
                colors: product.colors.map((color) => ({
                  id: color.colorId,
                  color: color.color.color,
                })),
                collection: {
                  ...product.collection.get(),
                  brandName: product.collection.brand.brandName,
                },
                sizes: product.sizes.map((size) => ({
                  id: size.sizeId,
                  sizeName: size.size.sizeName,
                })),
                saleType: product.saleType
                  ? { id: product.saleType.id, type: product.saleType.type }
                  : null,
              },
            };
          })
        );

        return {
          id: basket.id,
          userId: basket.userId,
          items: basketItems,
        };
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
}
