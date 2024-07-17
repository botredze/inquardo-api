import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { ReferenceDataService } from './referenct-data.service';

@ApiTags('Reference Data')
@Controller('reference-data')
export class ReferenceDataController {
  constructor(private readonly referenceDataService: ReferenceDataService) {}

  @Get('categories')
  @ApiQuery({ name: 'brandId', required: true, type: Number, description: 'The ID of the brand' })
  async findAllCategories(@Query('brandId') brandId: number) {
    return this.referenceDataService.findAllCategories(brandId);
  }

  @Get('colors')
  @ApiQuery({ name: 'brandId', required: true, type: Number, description: 'The ID of the brand' })
  async findAllColors(@Query('brandId') brandId: number) {
    return this.referenceDataService.findAllColors(brandId);
  }

  @Get('brands')
  async findAllBrands() {
    return this.referenceDataService.findAllBrands();
  }

  @Get('sizes')
  @ApiQuery({ name: 'brandId', required: true, type: Number, description: 'The ID of the brand' })
  async findAllSizes(@Query('brandId') brandId: number) {
    return this.referenceDataService.findAllSizes(brandId);
  }

  @Get('coatings')
  @ApiQuery({ name: 'brandId', required: true, type: Number, description: 'The ID of the brand' })
  async findAllCoatings(@Query('brandId') brandId: number) {
    return this.referenceDataService.findAllCoatings(brandId);
  }

  @Get('masonry-types')
  @ApiQuery({ name: 'brandId', required: true, type: Number, description: 'The ID of the brand' })
  async findAllMasonryTypes(@Query('brandId') brandId: number) {
    return this.referenceDataService.findAllMasonryTypes(brandId);
  }
}
