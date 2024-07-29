import { Controller, Post, Get, Param, Body, HttpException, HttpStatus, Req } from '@nestjs/common';
import { ViewUserHistoryService } from './view-user-history.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiBody } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

@Controller('view-history')
@ApiTags('View History')
export class ViewUserHistoryController {
  constructor(private readonly viewUserHistoryService: ViewUserHistoryService, private readonly jwtService: JwtService) {}

  @Get()
  async findUserViewHistory( @Req() req: Request) {
    const authHeader = req.headers['authorization'];
    const userId = authHeader ? this.decodeUserIdFromToken(authHeader) : null;
    return this.viewUserHistoryService.findUserViewHistory(userId);
  }

  private decodeUserIdFromToken(authHeader: string): number {
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.decode(token) as { sub: number };
    return decodedToken.sub;
  }

}
