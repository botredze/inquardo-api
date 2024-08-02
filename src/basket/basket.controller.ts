import { Body, Controller, HttpStatus, Get, Param, Post, Delete, Req } from "@nestjs/common";
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { BasketService } from "./basket.service";
import { AddItemDto } from "./dto/add-item.dto";
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
  async addItemToBasket(@Req() req: Request, @Body() addItemDto: AddItemDto): Promise<any> {
    try {
      const authHeader = req.headers['authorization'];
      const userId = this.basketService.decodeUserIdFromToken(authHeader);
      await this.basketService.addItemToBasket(userId, addItemDto.productId, addItemDto.colorId, addItemDto.sizeId, addItemDto.count);
      return { message: 'Item added to basket successfully' };
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
}
