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
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '../database/models/product.model';
import { ErrorResponseDto } from './dto/error-response.dto';
import { FilesInterceptor } from "@nestjs/platform-express";
import { JwtService } from '@nestjs/jwt';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService, private readonly jwtService: JwtService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'The product has been successfully created.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos', 10))
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Product> {
    try {
      console.log(createProductDto, files);
      return await this.productsService.createProduct(createProductDto, files);
    } catch (error) {
      console.log('error', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of all products', type: [Product] })
  @ApiQuery({ name: 'brandId', required: false, description: 'Filter products by brand ID', type: Number })
  @Get()
  findAll(@Query('brandId') brandId?: number) {
    return this.productsService.findAll(brandId);
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
