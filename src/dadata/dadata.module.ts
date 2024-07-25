import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { DaDataController } from './dadata.controller';
import { DaDataService } from './dadata.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [DaDataController],
  providers: [DaDataService],
})
export class AppModule {}
