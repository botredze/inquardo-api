import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { Op } from 'sequelize';
import { User } from '../database/models/user.model';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TempUserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  async createOrLoginUser(phone?: string, otp?: string): Promise<{ id: number, phone: string, token: string }> {
    let user = await this.userModel.findOne({ where: { phone, otp } });

    if (!user) {
      const generatedPhone = this.generateRandomPhoneNumber();
      const generatedOtp = this.generateRandomOtp();
      const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 дня

      user = await this.userModel.create({ phone: generatedPhone, otp: generatedOtp, expiresAt });
    }

    const payload = { phone: user.phone, sub: user.id };
    const token = this.jwtService.sign(payload);

    return { id: user.id, phone: user.phone, token };
  }

  @Cron('0 0 * * *')
  async cleanExpiredUsers(): Promise<void> {
    await this.userModel.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date(),
        },
      },
    });
  }

  private generateRandomPhoneNumber(): string {
    return '+1' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }

  private generateRandomOtp(): string {
    return crypto.randomBytes(3).toString('hex');
  }
}
