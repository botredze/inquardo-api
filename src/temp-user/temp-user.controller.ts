import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TempUserService } from './temp-user.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('temp-user')
@Controller('temp-user')
export class TempUserController {
  constructor(private readonly tempUserService: TempUserService) {}

  @Get('login-or-register')
  async loginOrRegister(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    const user = await this.tempUserService.createOrLoginUser(authHeader);
    return user;
  }
}
