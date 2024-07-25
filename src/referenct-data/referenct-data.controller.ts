import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { ReferenceDataService } from './referenct-data.service';

@ApiTags('Reference Data')
@Controller('reference-data')
export class ReferenceDataController {
  constructor(private readonly referenceDataService: ReferenceDataService) {}

  @Get('brands')
  async findAllBrands() {
    return this.referenceDataService.findAllBrands();
  }

  @Get('brand-data')
  @ApiQuery({ name: 'brandId', required: true, type: Number, description: 'The ID of the brand' })
  async findAllDataForBrand(@Query('brandId') brandId: number) {
    return this.referenceDataService.findAllDataForBrand(brandId);
  }
}
