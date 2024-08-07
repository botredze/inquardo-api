import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SpColorPalitry } from '../database/models/sp-color-palitry.model';
import { SpBrand } from '../database/models/sp-brand.model';
import { SpSizeRate } from '../database/models/sp-size-rate.model';
import { ReferenceDataController } from "./referenct-data.controller";
import { ReferenceDataService } from "./referenct-data.service";
import { Product } from "../database/models/product.model";
import { SpMasonry } from '../database/models/sp-masonry.model';
import { spCoatingModel } from '../database/models/sp-coating.model';
import { spTextureModel } from '../database/models/sp-texture.model';
import { ProductStatus } from 'src/database/models/product-status.model';
import { SpFactureModel } from '../database/models/sp_facture.model';

@Module({
  imports: [
    SequelizeModule.forFeature([SpColorPalitry, SpBrand, SpSizeRate, Product, SpMasonry, spCoatingModel, spTextureModel, ProductStatus, SpFactureModel]),
  ],
  controllers: [ReferenceDataController],
  providers: [ReferenceDataService],
})
export class ReferenceDataModule {}
