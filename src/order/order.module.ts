import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from '../database/models/order.model';
import { OrderItem } from '../database/models/order-item.model';
import { UserDetails } from '../database/models/user-details.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Order,
      OrderItem,
      UserDetails
    ])
  ],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
