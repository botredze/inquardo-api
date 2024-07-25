import { Product } from '../database/models/product.model';
import { Category } from '../database/models/category.model';
import { SpColorPalitry } from '../database/models/sp-color-palitry.model';
import { SpBrand } from '../database/models/sp-brand.model';
import { SpSizeRate } from '../database/models/sp-size-rate.model';
import { InjectModel } from '@nestjs/sequelize';
import { SpMasonry } from '../database/models/sp-masonry.model';
import { spCoatingModel } from '../database/models/sp-coating.model';
import { Injectable } from '@nestjs/common';
import { spTextureModel } from '../database/models/sp-texture.model';

@Injectable()
export class ReferenceDataService {
  constructor(
    @InjectModel(Category) private readonly categoryModel: typeof Category,
    @InjectModel(SpColorPalitry) private readonly colorModel: typeof SpColorPalitry,
    @InjectModel(SpBrand) private readonly brandModel: typeof SpBrand,
    @InjectModel(SpSizeRate) private readonly sizeModel: typeof SpSizeRate,
    @InjectModel(Product) private readonly productModel: typeof Product,
    @InjectModel(spCoatingModel) private readonly coatingModel: typeof spCoatingModel,
    @InjectModel(SpMasonry) private readonly masonryModel: typeof SpMasonry,
    @InjectModel(spTextureModel) private readonly textureModel: typeof spTextureModel,
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
      group: ['SpBrand.id'],
    });
    return brands;
  }

  async findAllDataForBrand(brandId: number) {
    const colors = await this.colorModel.findAll({ where: { brandId } });
    const sizes = await this.sizeModel.findAll({ where: { brandId } });
    const coatings = await this.coatingModel.findAll({ where: { brandId } });
    const masonryTypes = await this.masonryModel.findAll({ where: { brandId } });
    const texture = await this.textureModel.findAll()

    return {
      colors,
      sizes,
      coatings,
      masonryTypes,
      texture
    };
  }
}
