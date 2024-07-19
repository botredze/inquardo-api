import { Module } from '@nestjs/common';
import { TempUserService } from './temp-user.service';
import { TempUserController } from './temp-user.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../database/models/user.model';

@Module({
  imports: [
  SequelizeModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: 'Afina954120',
      signOptions: { expiresIn: '3d' },
    }),
  ],
  providers: [TempUserService],
  controllers: [TempUserController],

})
export class TempUserModule {}
