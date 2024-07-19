import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TempUserService } from './temp-user.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('temp-user')
@Controller('temp-user')
export class TempUserController {
  constructor(private readonly tempUserService: TempUserService) {}

  @Post('login-or-register')
  async loginOrRegister(@Body() body: any) {
    const { phone, otp } = body;

    const user = await this.tempUserService.createOrLoginUser(phone, otp);
    return user;
  }

 // @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  async getProtectedRoute(@Req() req: Request) {
    const header = req.headers
    console.log(header, 'header ххухухуххух');
    const authHeader = req.headers['authorization'];

    console.log('Authorization Header:', authHeader);

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      console.log('Bearer Token:', token);
    }

    return { message: 'This is a protected route' };
  }
}
