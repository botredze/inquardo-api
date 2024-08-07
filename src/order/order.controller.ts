import { Controller, Post, Body, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from '../database/models/order.model';
import { CreateOrderDto } from './dto/cretate.order.dto';
import { Request } from 'express';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder( @Body() createOrderDto: CreateOrderDto,   @Req() req: Request): Promise<Order> {
    const authHeader = req.headers['authorization'];
    const userId = this.orderService.decodeUserIdFromToken(authHeader);
    return this.orderService.createOrder(createOrderDto, userId);
  }
}
