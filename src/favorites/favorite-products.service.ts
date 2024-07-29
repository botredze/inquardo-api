import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../database/models/product.model';
import { FavoriteProduct } from "../database/models/favorite.model";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class FavoriteProductsService {
  constructor(
    @InjectModel(FavoriteProduct) private favoriteProductModel: typeof FavoriteProduct,
    private readonly jwtService: JwtService,
  ) {}

  async addToFavorites(userId: number, productId: number, colorId: number, sizeId: number) {
    try {
      const fav = await this.favoriteProductModel.create({ userId, productId, colorId, sizeId })
      return { sub: fav.id };
    } catch (error) {
      throw new Error('Failed to add to favorites');
    }
  }

  async removeFromFavorites(userId: number, productId: number): Promise<void> {
    await this.favoriteProductModel.destroy({ where: { userId, productId } });
  }

  async getFavoritesByUserId(userId: number): Promise<Product[]> {
    const favoriteProducts = await this.favoriteProductModel.findAll({ where: { userId }, include: [Product] });
    return favoriteProducts.map(fp => fp.product);
  }

  decodeUserIdFromToken(authHeader: string): number {
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.decode(token) as { sub: number };
    return decodedToken.sub;
  }
}
