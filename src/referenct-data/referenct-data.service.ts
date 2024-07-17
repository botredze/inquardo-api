import { Product } from '../database/models/product.model';
import { Category } from '../database/models/category.model';
import { SpColorPalitry } from '../database/models/sp-color-palitry.model';
import { SpBrand } from '../database/models/sp-brand.model';
import { SpSizeRate } from '../database/models/sp-size-rate.model';
import { InjectModel } from '@nestjs/sequelize';
import { SpMasonry } from '../database/models/sp-masonry.model';
import { spCoatingModel } from '../database/models/sp-coating.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReferenceDataService {
  constructor(
    @InjectModel(Category) private readonly categoryModel: typeof Category,
    @InjectModel(SpColorPalitry) private readonly colorModel: typeof SpColorPalitry,
    @InjectModel(SpBrand) private readonly brandModel: typeof SpBrand,
    @InjectModel(SpSizeRate) private readonly sizeModel: typeof SpSizeRate,
    @InjectModel(Product) private readonly productModel: typeof Product,
    @InjectModel(spCoatingModel) private readonly coatingModel: typeof spCoatingModel, // Inject spCoating model
    @InjectModel(SpMasonry) private readonly masonryModel: typeof SpMasonry, // Inject SpMasonry model
  ) {}

  async findAllCategories(brandId: number) {
    const categories = await this.categoryModel.findAll({
      where: { brandId },
      attributes: {
        include: [
          [
            this.productModel.sequelize.fn('COUNT', this.productModel.sequelize.col('products.id')),
            'count',
          ],
        ],
      },
      include: [
        {
          model: Product,
          attributes: [],
        },
      ],
      group: ['Category.id'],
    });
    return categories;
  }

  findAllColors(brandId: number) {
    return this.colorModel.findAll({ where: { brandId } });
  }

  findAllBrands() {
    return this.brandModel.findAll();
  }

  findAllSizes(brandId: number) {
    return this.sizeModel.findAll({ where: { brandId } });
  }

  findAllCoatings(brandId: number) {
    return this.coatingModel.findAll({ where: { brandId } });
  }

  findAllMasonryTypes(brandId: number) {
    return this.masonryModel.findAll({ where: { brandId } });
  }
}
