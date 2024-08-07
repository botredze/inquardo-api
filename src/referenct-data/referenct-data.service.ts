import { Product } from '../database/models/product.model';
import { SpColorPalitry } from '../database/models/sp-color-palitry.model';
import { SpBrand } from '../database/models/sp-brand.model';
import { SpSizeRate } from '../database/models/sp-size-rate.model';
import { InjectModel } from '@nestjs/sequelize';
import { SpMasonry } from '../database/models/sp-masonry.model';
import { spCoatingModel } from '../database/models/sp-coating.model';
import { Injectable } from '@nestjs/common';
import { spTextureModel } from '../database/models/sp-texture.model';
import { ProductStatus } from 'src/database/models/product-status.model';
import { SpFactureModel } from '../database/models/sp_facture.model';

@Injectable()
export class ReferenceDataService {
  constructor(
    @InjectModel(SpColorPalitry) private readonly colorModel: typeof SpColorPalitry,
    @InjectModel(SpBrand) private readonly brandModel: typeof SpBrand,
    @InjectModel(SpSizeRate) private readonly sizeModel: typeof SpSizeRate,
    @InjectModel(Product) private readonly productModel: typeof Product,
    @InjectModel(spCoatingModel) private readonly coatingModel: typeof spCoatingModel,
    @InjectModel(SpMasonry) private readonly masonryModel: typeof SpMasonry,
    @InjectModel(spTextureModel) private readonly textureModel: typeof spTextureModel,
    @InjectModel(ProductStatus) private readonly statusModel: typeof ProductStatus,
    @InjectModel(SpFactureModel) private readonly  factureModel: typeof SpFactureModel,
  ) {}

  async findAllBrands() {
    const brands = await this.brandModel.findAll({
      attributes: [
        'id',
        'brandName',
        [this.productModel.sequelize.fn('COUNT', this.productModel.sequelize.col('products.id')), 'productCount']
      ],
      include: [
        {
          model: Product,
          attributes: [],
          required: false,
        },
      ],
      group: ['SpBrand.id', 'SpBrand.brandName'],
      order: [['position', 'ASC']]
    });
    return brands;
  }

  async findAllDataForBrand(brandId: number) {
    console.log(brandId);

    const colors = await this.colorModel.findAll({
      where: { brandId },
      order: [['position', 'ASC']]
    });

    const sizes = await this.sizeModel.findAll({
      where: { brandId },
      order: [['position', 'ASC']]
    });

    const coatings = await this.coatingModel.findAll({
      where: { brandId },
      order: [['position', 'ASC']]
    });

    const masonryTypes = await this.masonryModel.findAll({
      order: [['position', 'ASC']]
    });

    const texture = await this.textureModel.findAll({
      order: [['position', 'ASC']]
    });

    const status = await this.statusModel.findAll({
      order: [['position', 'ASC']]
    });

    const facture = await this.factureModel.findAll({
      order: [['position', 'ASC']]
    });

    const minPrice = await this.productModel.min('price', { where: { brandId } });
    const maxPrice = await this.productModel.max('price', { where: { brandId } });

    return {
      colors,
      sizes,
      coatings,
      masonryTypes,
      texture,
      status,
      minPrice,
      maxPrice,
      facture
    };
  }

}
