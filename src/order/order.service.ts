import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import nodemailer from 'nodemailer';
import { Order } from '../database/models/order.model';
import { OrderItem } from '../database/models/order-item.model';
import { CreateOrderDto } from './dto/cretate.order.dto';
import { UserDetails } from '../database/models/user-details.model';
import Telegram from 'node-telegram-api';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OrderService {
  private telegram: Telegram;

  constructor(
    @InjectModel(Order) private readonly orderModel: typeof Order,
    @InjectModel(OrderItem) private readonly orderItemModel: typeof OrderItem,
    @InjectModel(UserDetails) private readonly userModel: typeof UserDetails,
    private readonly jwtService: JwtService,
  ) {
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    this.telegram = new Telegram(telegramToken);
  }

  async createOrder(createOrderDto: CreateOrderDto, userId): Promise<Order> {
    const { basketItems, totalPrice, basketId } = createOrderDto;

    console.log(basketItems, 'basketItems');
    const order = await this.orderModel.create({
      basketId,
      userId,
      orderDate: new Date(),
      status: 'Pending',
      totalPrice,
    });

    const orderItems = basketItems.map(item => ({
      orderId: order.id,
      productId: item.productId,
      count: item.count,
      price: item.price,
    }));

    await this.orderItemModel.bulkCreate(orderItems);

    const user = await this.userModel.findByPk(userId);

    await this.sendTelegramNotification(user.firstName, order.id, totalPrice);

    await this.sendEmailNotification(user.email, order.id, totalPrice);

    return order;
  }

  private async sendTelegramNotification(username: string, orderId: number, totalPrice: number) {
    const chatId = parseInt(process.env.TELEGRAM_CHAT_ID, 10);

    if (isNaN(chatId)) {
      console.error('Invalid TELEGRAM_CHAT_ID. It must be a number.');
      return;
    }

    const message = `Новый заказ оформлен!\nOrder ID: ${orderId}\nTotal Price: ${totalPrice}`;

    try {
      await this.telegram.sendMessage(chatId, message);
      console.log('Telegram notification sent.');
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
    }
  }


  private async sendEmailNotification(to: string, orderId: number, totalPrice: number) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Ваш заказ подтвержден',
      text: `Спасибо за ваш заказ, в скором времени с вами свяжется менеджер!\n Order ID: ${orderId}\n Total Price: ${totalPrice}`,
    };

    await transporter.sendMail(mailOptions);
  }

  decodeUserIdFromToken(authHeader: string): number {
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.decode(token) as { sub: number };
    return decodedToken.sub;
  }

}
