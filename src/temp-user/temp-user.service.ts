import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { Op } from 'sequelize';
import { User } from '../database/models/user.model';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FavoriteProduct } from '../database/models/favorite.model';
import { ViewUserHistory } from '../database/models/view-user-history.model';
import { Sequelize } from 'sequelize-typescript';
import { Basket } from '../database/models/basket.model';
import { UserDetails } from '../database/models/user-details.model';

@Injectable()
export class TempUserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Basket)
    private readonly basketModel: typeof Basket,
    @InjectModel(ViewUserHistory)
    private readonly viewUserHistoryModel: typeof ViewUserHistory,
    @InjectModel(FavoriteProduct)
    private readonly favoriteProductModel: typeof FavoriteProduct,
    private readonly sequelize: Sequelize,
    private readonly jwtService: JwtService,
  ) {}

  async createOrLoginUser(authToken?:string): Promise<{ id: number, token: string }> {
    let userIdFromToken: number = null;

    console.log(authToken, 'authToken');
    if (authToken) {
      try {
        const decodedToken = this.jwtService.verify(authToken);
        userIdFromToken = decodedToken.sub;
      } catch (err) {
        throw new Error('Invalid token');
      }
    }
    if (userIdFromToken) {
      const user = await this.userModel.findByPk(userIdFromToken);
      if (user) {
        return { id: user.id, token: authToken };
      } else {
        throw new Error('User not found');
      }
    } else {
      const generatedPhone = this.generateRandomPhoneNumber();
      const generatedOtp = this.generateRandomOtp();
      const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

      const user = await this.userModel.create({ phone: generatedPhone, otp: generatedOtp, expiresAt });

      const payload = { sub: user.id };
      const token = this.jwtService.sign(payload);

      return { id: user.id, token };
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async cleanExpiredUsers(): Promise<void> {
    const transaction = await this.sequelize.transaction();

    try {
      const expiredUsers = await this.userModel.findAll({
        where: {
          expiresAt: {
            [Op.lt]: new Date(),
          },
        },
        transaction,
      });

      const userIds = expiredUsers.map(user => user.id);


      await this.basketModel.destroy({
        where: {
          userId: {
            [Op.in]: userIds,
          },
        },
        transaction,
      });

      await this.viewUserHistoryModel.destroy({
        where: {
          userId: {
            [Op.in]: userIds,
          },
        },
        transaction,
      });

      await this.favoriteProductModel.destroy({
        where: {
          userId: {
            [Op.in]: userIds,
          },
        },
        transaction,
      });

      await this.userModel.destroy({
        where: {
          id: {
            [Op.in]: userIds,
          },
        },
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  private generateRandomPhoneNumber(): string {
    return '+1' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }

  private generateRandomOtp(): string {
    return crypto.randomBytes(3).toString('hex');
  }
}
