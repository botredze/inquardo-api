import { Controller, Post, Body } from '@nestjs/common';
import { DaDataService } from './dadata.service';

@Controller('dadata')
export class DaDataController {
  constructor(private readonly daDataService: DaDataService) {}

  @Post('clean-address')
  async cleanAddress(@Body('address') address: string) {
    return await this.daDataService.cleanAddress(address);
  }
}
