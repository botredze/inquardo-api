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
  UploadedFiles
} from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '../database/models/product.model';
import { ErrorResponseDto } from './dto/error-response.dto';
import { FilesInterceptor } from "@nestjs/platform-express";
import { ProductFilterDto } from './dto/product-filter.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product found', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found', type: ErrorResponseDto })
  @Get('details/:id')
  async findOne(@Param('id') id: number) {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new HttpException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Product not found',
      }, HttpStatus.NOT_FOUND);
    }
    return product;
  }


  @ApiOperation({ summary: 'Filter products by criteria' })
  @ApiResponse({ status: 200, description: 'Returns filtered products based on criteria' })
  @ApiBody({ type: ProductFilterDto })
  @Post('filter')
  async findByFilter(@Body() filters: ProductFilterDto) {
    return this.productsService.findByFilter(filters);
  }
}
