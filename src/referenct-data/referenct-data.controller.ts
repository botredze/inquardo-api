import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'; // Import ApiTags decorator
import { ReferenceDataService } from "./referenct-data.service";

@ApiTags('Reference Data') // Add ApiTags decorator to specify the tag for Swagger
@Controller('reference-data')
export class ReferenceDataController {
  constructor(private readonly referenceDataService: ReferenceDataService) {}

  @Get('categories')
  async findAllCategories() {
    return this.referenceDataService.findAllCategories();
  }

  @Get('colors')
  async findAllColors() {
    return this.referenceDataService.findAllColors();
  }

  @Get('brands')
  async findAllBrands() {
    return this.referenceDataService.findAllBrands();
  }

  @Get('sizes')
  async findAllSizes() {
    return this.referenceDataService.findAllSizes();
  }

  @Get('coatings')
  async findAllCoatings() {
    return this.referenceDataService.findAllCoatings();
  }

  @Get('masonry-types')
  async findAllMasonryTypes() {
    return this.referenceDataService.findAllMasonryTypes();
  }
}
