import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Product } from "../database/models/product.model";
import { ProductColor } from "../database/models/product-color.model";
import { Op } from "sequelize";
import { spCoatingModel } from '../database/models/sp-coating.model';
import { SpMasonry } from '../database/models/sp-masonry.model';
import { spTextureModel } from '../database/models/sp-texture.model';
import { CollectionModel } from '../database/models/collection.model';
import { ProductPhoto } from "../database/models/product-photo.model";
import { SpColorPalitry } from "../database/models/sp-color-palitry.model";
import { SpSizeRate } from "../database/models/sp-size-rate.model";
import { ProductSize } from "../database/models/product-size.model";

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
  ) {}

  async search(query: string) {
    console.log('Search query:', query);

    const results = await this.productModel.findAll({
      include: [
        ProductPhoto,
        {
          model: ProductSize,
          attributes: ["sizeId"],
          include: [{ model: SpSizeRate, attributes: ["id", "sizeName"] }]
        },
        {
          model: ProductColor,
          attributes: ["colorId"],
          include: [{ model: SpColorPalitry, attributes: ["id", "color"] }]
        },
        {
          model: CollectionModel,
          attributes: ['collectionName'],
          where: {
            collectionName: { [Op.like]: `%${query}%` }
          }
        },
        {
          model: spTextureModel,
          attributes: ['texture_name'],
          where: {
            texture_name: { [Op.like]: `%${query}%` }
          }
        },
        {
          model: spCoatingModel,
          attributes: ['coating_name'],
          where: {
            coating_name: { [Op.like]: `%${query}%` }
          }
        },
        {
          model: SpMasonry,
          attributes: ['masonry_name'],
          where: {
            masonry_name: { [Op.like]: `%${query}%` }
          }
        }
      ],
      where: {
        material: { [Op.like]: `%${query}%` }
      },
      logging: console.log
    });

    console.log('Search results:', results);
    return results;
  }
}
