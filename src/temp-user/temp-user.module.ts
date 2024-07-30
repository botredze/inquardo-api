import { Module } from '@nestjs/common';
import { TempUserService } from './temp-user.service';
import { TempUserController } from './temp-user.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../database/models/user.model';
import { Basket } from '../database/models/basket.model';
import { ViewUserHistory } from '../database/models/view-user-history.model';
import { FavoriteProduct } from '../database/models/favorite.model';

@Module({
  imports: [
  SequelizeModule.forFeature([User, Basket, ViewUserHistory, FavoriteProduct]),
    PassportModule,
    JwtModule.register({
      secret: 'Afina954120',
      signOptions: { expiresIn: '3m' },
    }),
  ],
  providers: [TempUserService],
  controllers: [TempUserController],

})
export class TempUserModule {}
