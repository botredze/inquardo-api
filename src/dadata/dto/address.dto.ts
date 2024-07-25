import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty({
    description: 'The address that needs to be cleaned',
    example: '123 Main St, Springfield, IL',
  })
  @IsString()
  address: string;
}
