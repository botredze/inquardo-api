import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Query,
  UseInterceptors,
  UploadedFiles, Req,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductsDto } from './dto/create-product.dto';
import { Product } from '../database/models/product.model';
import { ErrorResponseDto } from './dto/error-response.dto';
import { FilesInterceptor } from "@nestjs/platform-express";
import { JwtService } from '@nestjs/jwt';
import { ProductFilterDto } from './dto/product-filter.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService, private readonly jwtService: JwtService) {}

  @Post('create')
  async createProducts(@Body() createProductsDto: CreateProductsDto) {
    const { data, brandId } = createProductsDto;
    return this.productsService.createProducts(data, brandId);
  }

  @Post()
  findAll(@Body() filters: ProductFilterDto) {
    return this.productsService.findByFilter(filters);
  }

  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product found', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found', type: ErrorResponseDto })
  @Get('details/:id')
  async findOne(@Param('id') id: number, @Req() req: Request) {
    try {
      const authHeader = req.headers['authorization'];
      const userId = authHeader ? this.decodeUserIdFromToken(authHeader) : null;
      const product = await this.productsService.findOne(id, userId);
      if (!product) {
        throw new HttpException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product not found',
        }, HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      console.log(error);
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private decodeUserIdFromToken(authHeader: string): number {
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.decode(token) as { sub: number };
    return decodedToken.sub;
  }
}
