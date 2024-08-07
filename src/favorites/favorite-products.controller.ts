import { Controller, Get, Param, Post, Delete, Body, Req } from '@nestjs/common';
import { FavoriteProductsService } from './favorite-products.service';
import { Product } from "../database/models/product.model";
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoriteProductsController {
  constructor(private favoriteProductsService: FavoriteProductsService) {}

  @Post()
  async addToFavorites(@Req() req: Request, @Body() product) {
    const authHeader = req.headers['authorization'];
    const userId = this.favoriteProductsService.decodeUserIdFromToken(authHeader);
    return this.favoriteProductsService.addToFavorites(userId, product);
  }

  @Delete(':productId')
  async removeFromFavorites(@Req() req: Request, @Param('productId') productId: number): Promise<void> {
    const authHeader = req.headers['authorization'];
    const userId = this.favoriteProductsService.decodeUserIdFromToken(authHeader);
    await this.favoriteProductsService.removeFromFavorites(userId, productId);
  }

  @Get()
  async getFavoritesByUserId(@Req() req: Request): Promise<Product[]> {
    const authHeader = req.headers['authorization'];
    const userId = this.favoriteProductsService.decodeUserIdFromToken(authHeader);
    return this.favoriteProductsService.getFavoritesByUserId(userId);
  }


  @Post('counter-favourite')
  async counterFavourite(
    @Body() body: { typeCounter: number; id: number },
    @Req() req: Request
  ) {
    const authHeader = req.headers['authorization'];
    const userId = this.favoriteProductsService.decodeUserIdFromToken(authHeader);
    const { typeCounter, id: productId } = body;

    return this.favoriteProductsService.updateFavoriteCount(userId, productId, typeCounter);
  }

}
