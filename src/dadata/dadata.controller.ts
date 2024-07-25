import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { DaDataService } from './dadata.service';
import { AddressDto } from './dto/address.dto';

@ApiTags('DaData')
@Controller('dadata')
export class DaDataController {
  constructor(private readonly daDataService: DaDataService) {}

  @Post('clean-address')
  @ApiOperation({
    summary: 'Clean and normalize address',
    description: 'Cleans and normalizes the provided address using DaData service.',
  })
  @ApiBody({
    description: 'Address to be cleaned',
    type: AddressDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully cleaned address',
    schema: {
      example: {
        address: 'Normalized address',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid address format or request',
  })
  async cleanAddress(@Body('address') address: string) {
    return await this.daDataService.cleanAddress(address);
  }
}
