import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from '../database/models/order.model';
import { CreateOrderDto } from './dto/cretate.order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(createOrderDto);
  }
}
