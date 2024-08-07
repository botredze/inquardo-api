import { Body, Controller, HttpStatus, Get, Param, Post, Delete, Req } from "@nestjs/common";
import {  ApiTags } from "@nestjs/swagger";
import { BasketService } from "./basket.service";
import { Request } from 'express';

@ApiTags('basket')
@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Get()
  async getUserBasket(@Req() req: Request): Promise<any> {
    try {
      const authHeader = req.headers['authorization'];
      const userId = this.basketService.decodeUserIdFromToken(authHeader);
      const basket = await this.basketService.getUserBasket(userId);
      return basket || null;
    } catch (error) {
      console.error('Error getting user basket:', error);
      throw HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  @Post('addItem')
  async addItemToBasket(@Req() req: Request, @Body() product): Promise<{ itemId: number }> {
    try {
      const authHeader = req.headers['authorization'];
      const userId = this.basketService.decodeUserIdFromToken(authHeader);
      const itemId = await this.basketService.addItemToBasket(userId, product );

      return { itemId };
    } catch (error) {
      console.error('Error adding item to basket:', error);
      throw HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  @Delete('item/:itemId')
  async removeItemFromBasket(@Req() req: Request, @Param('itemId') itemId: number): Promise<any> {
    try {
      const authHeader = req.headers['authorization'];
      const userId = this.basketService.decodeUserIdFromToken(authHeader);
      await this.basketService.removeItemFromBasket(userId, itemId);
      return { message: 'Item removed from basket successfully' };
    } catch (error) {
      console.error('Error removing item from basket:', error);
      throw HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  @Post('counter-basket')
  async counterFavourite(
    @Body() body: { typeCounter: number; id: number },
    @Req() req: Request
  ) {
    const authHeader = req.headers['authorization'];
    const userId = this.basketService.decodeUserIdFromToken(authHeader);
    const { typeCounter, id: productId } = body;
    console.log(userId, productId, typeCounter, 'userId, productId, typeCounter');
    return this.basketService.updateBasketCount(userId, productId, typeCounter);
  }
}
