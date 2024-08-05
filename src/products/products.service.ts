import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Product } from "../database/models/product.model";
import { CreateProductsDto } from "./dto/create-product.dto";
import { ProductColor } from "../database/models/product-color.model";
import { ProductSize } from "../database/models/product-size.model";
import { ProductRecommendation } from "../database/models/product-recommendations.model";
import { Op } from "sequelize";
import { ProductPhoto } from "../database/models/product-photo.model";
import { S3Service } from "../s3/s3.service";
import { SpColorPalitry } from "../database/models/sp-color-palitry.model";
import { SpSizeRate } from "../database/models/sp-size-rate.model";
import { Sequelize } from "sequelize-typescript";
import { Rating } from "../database/models/rating.model";
import { spCoatingModel } from '../database/models/sp-coating.model';
import { SpMasonry } from '../database/models/sp-masonry.model';
import { ProductFilterDto } from './dto/product-filter.dto';
import { SpSaleTypeModel } from '../database/models/sp-sale-type.model';
import { spTextureModel } from '../database/models/sp-texture.model';
import { ProductStatus } from "src/database/models/product-status.model";
import { ViewUserHistory } from '../database/models/view-user-history.model';
import { CollectionModel } from '../database/models/collection.model';
import { SpBrand } from '../database/models/sp-brand.model';
import { SpFactureModel } from "src/database/models/sp_facture.model";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
    @InjectModel(ViewUserHistory) private viewUserHistoryModel: typeof ViewUserHistory,
    @InjectModel(CollectionModel) private readonly collectionModel: typeof CollectionModel,
    @InjectModel(SpMasonry) private readonly masonryModel: typeof SpMasonry,
    @InjectModel(spCoatingModel) private readonly coatingModel: typeof spCoatingModel,
    @InjectModel(spTextureModel) private readonly textureModel: typeof spTextureModel,
    @InjectModel(SpSaleTypeModel) private readonly saleTypeModel: typeof SpSaleTypeModel,
    @InjectModel(ProductStatus) private readonly statusModel: typeof ProductStatus,
    @InjectModel(ProductPhoto) private readonly photoModel: typeof ProductPhoto,
    @InjectModel(SpColorPalitry) private readonly spColorPalitryModel: typeof SpColorPalitry,
    @InjectModel(SpSizeRate) private readonly spSizeRateModel: typeof SpSizeRate,
    @InjectModel(ProductColor) private readonly productColorModel: typeof ProductColor,
    @InjectModel(ProductSize) private readonly productSizeModel: typeof ProductSize,
    @InjectModel(SpFactureModel) private readonly spFactureModel: typeof SpFactureModel,
    private readonly s3Service: S3Service
  ) {
  }

  async findOrCreate(model, where, additionalParams = {}) {
    try {
      const query = { ...where, ...additionalParams };
      console.log('Creating or finding:', query); // Отладочный вывод
      let record = await model.findOne({ where: query });
      if (!record) {
        record = await model.create(query);
      }
      return record;
    } catch (error) {
      console.error('Error in findOrCreate:', error); // Подробное логирование ошибки
      throw error;
    }
  }  

async createProducts(data: any[], brandId: number) {
  for (const item of data) {
      const collection = await this.findOrCreate(this.collectionModel, { collectionName: item.name }, { brandId });
      const masonry = await this.findOrCreate(this.masonryModel, { masonry_name: item.mansory }, { brandId });
      const coating = await this.findOrCreate(this.coatingModel, { coating_name: item.coating }, { brandId });
      const texture = await this.findOrCreate(this.textureModel, { texture_name: item.texture });
      const status = await this.findOrCreate(this.statusModel, { status: item.status });
      const saleType = await this.findOrCreate(this.saleTypeModel, { type: item.type });
      const facture = await this.findOrCreate(this.spFactureModel, {facture_name: item.facture})

      const product = await this.productModel.create({
          price: parseFloat(item.price.replace(',', '.')),
          material: 'керамика',
          country: item.country,
          articul: item.articles,
          complect: item.komplect,
          collectionId: collection.id,
          brandId,
          coatingId: coating.id,
          saleTypeId: saleType.id,
          textureId: texture.id,
          masonryId: masonry.id,
          statusId: status.id,
          factureId: facture.id,
      });

      await this.photoModel.create({
          productId: product.id,
          url: 'https://inquadro-bucket.fra1.cdn.digitaloceanspaces.com/photos/bas_01.jpg',
          main: true,
          interier: false,
      });

      const color = await this.findOrCreate(this.spColorPalitryModel, { color: item.color }, { brandId });
      await this.productColorModel.create({
          productId: product.id,
          colorId: color.id,
      });

      const size = await this.findOrCreate(this.spSizeRateModel, { sizeName: item.size }, { brandId });
      await this.productSizeModel.create({
          productId: product.id,
          sizeId: size.id,
      });   
  }
}

  async findAll(brandId?: number) {
    return this.productModel.findAll({
      include: [
        ProductPhoto,
        {
          model: CollectionModel,
          attributes: ['collectionName', 'brandId'],
          include: [
            {
              model: SpBrand,
              attributes: [['brandName', 'productName']],
            }
          ],
          where: brandId ? { brandId } : undefined,
        },
        {
          model: spCoatingModel,
          attributes: ['coating_name'],
        },
        {
          model: SpMasonry,
          attributes: ['masonry_name'],
        },
        {
          model: spTextureModel,
          attributes: ['texture_name'],
        },
        {
          model: ProductStatus,
          attributes: ['status'],
        }
      ],
      order: [['id', 'ASC']],
    }).then(products => {
      return products.map(product => ({
        ...product.get(),
        collection: {
          ...product.collection.get(),
          brandName: product.collection.brand.brandName
        }
      }));
    });
  }

  async findOne(id: number, userId?: number) {
    try {
      return this.productModel.findByPk(id, {
        include: [
          {
            model: CollectionModel,
            attributes: ['collectionName', 'brandId'],
            include: [
              {
                model: SpBrand,
                attributes: [['brandName', 'productName']],
              }
            ],
          },
          {
            model: ProductColor,
            attributes: ["colorId"],
            include: [{ model: SpColorPalitry, attributes: ["id", "color"] }]
          },
          {
            model: ProductSize,
            attributes: ["sizeId"],
            include: [{ model: SpSizeRate, attributes: ["id", "sizeName"] }]
          },
          {
            model: ProductRecommendation,
            include: [
              {
                model: Product,
                as: "recommendedProduct",
                include: [
                  ProductPhoto
                ]
              }
            ]
          },
          ProductPhoto,
          spTextureModel,
          ProductStatus,
          {
            model: spCoatingModel,
            attributes: ["id", "coating_name"]
          },
          {
            model: SpMasonry,
            attributes: ["id", "masonry_name"]
          },
          {
            model: SpSaleTypeModel,
            attributes: ["id", "type"]
          }
        ]
      }).then(async product => {
        if (product) {
          if (userId) {
            await this.createViewHistory(userId, id);
          }

          return {
            ...product.get(),
            collection: {
              ...product.collection.get(),
              brandName: product.collection?.brand?.brandName
            },
            colors: product.colors.map(color => ({ id: color.colorId, color: color.color.color })),
            sizes: product.sizes.map(size => ({ id: size.sizeId, sizeName: size.size.sizeName })),
            recommendations: product.recommendations.map(rec => ({
              ...rec.recommendedProduct.get(),
              photos: rec.recommendedProduct.photos
            })),
            coating: product.coating ? { id: product.coating.id, type: product.coating.coating_name } : null,
            saleType: product.saleType ? { id: product.saleType.id, type: product.saleType.type } : null
          };
        }
        return null;
      });
    }catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createViewHistory(userId: number, productId: number): Promise<ViewUserHistory> {
    try {
      const viewHistory = await this.viewUserHistoryModel.create({
        userId,
        productId,
        watchDate: new Date(),
      });
      return viewHistory;
    } catch (error) {
      throw new HttpException('Failed to create view history', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByFilter(filters: ProductFilterDto): Promise<any> {
    try {
      console.log(filters, 'filters');
      const { coating, color, kladka, price, size, status, texture, sorting, brandId } = filters;
  
      const where: any = {};
  
      if (coating && coating.length > 0) {
        where["$coating.id$"] = { [Op.in]: coating };
      }
  
      if (color && color.length > 0) {
        where["$colors.colorId$"] = { [Op.in]: color };
      }
  
      if (kladka && kladka.length > 0) {
        where["$masonry.id$"] = { [Op.in]: kladka };
      }
  
      if (price && (price.min !== undefined || price.max !== undefined)) {
        where.price = {};
        if (price.min !== undefined) {
          where.price[Op.gte] = price.min;
        }
        if (price.max !== undefined) {
          where.price[Op.lte] = price.max;
        }
      }
  
      // if (size !== undefined && size !== 0 && size) {
      //   where["$sizes.sizeId$"] = {[Op.in]: size};
      // }
  
      // if (status && status.length > 0) {
      //   where.status = { [Op.in]: status };
      // }
  
      if (texture && texture.length > 0) {
        where["$texture.id$"] = { [Op.in]: texture };
      }
  
      let sortCriteria = [];
      if (sorting) {
        switch (sorting) {
          case 1:
            sortCriteria.push(["price", "ASC"]);
            break;
          case 2:
            sortCriteria.push(["price", "DESC"]);
            break;
          case 3:
            sortCriteria.push(["createdAt", "DESC"]);
            break;
          default:
            break;
        }
      }
  
      console.log('where', where)
      const products = await Product.findAll({
        where,
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
            attributes: ['collectionName', 'brandId'],
            include: [
              {
                model: SpBrand,
                attributes: [['brandName', 'productName']],
              }
            ],
            where: brandId ? { brandId } : undefined,
          },
          {
            model: SpSaleTypeModel,
            attributes: ["id", "type"]
          },
          {
            model: spTextureModel,
            attributes: ["id", "texture_name"]
          },
          {
            model: ProductStatus,
            attributes: ["id", "status"]
          },
          {
            model: spCoatingModel,
            attributes: ["id", "coating_name"]
          },
          {
            model: SpMasonry,
            attributes: ["id", "masonry_name"]
          },
        ],
        order: sortCriteria
      });
  
      const prices = await Product.findAll({
        attributes: [
          [Sequelize.fn("MIN", Sequelize.col("price")), "minPrice"],
          [Sequelize.fn("MAX", Sequelize.col("price")), "maxPrice"]
        ]
      });
  
      const minPrice = prices[0].get("minPrice");
      const maxPrice = prices[0].get("maxPrice");
  
      const result = products.map(product => ({
        ...product.get(),
        collection: {
          ...product.collection.get(),
          brandName: product.collection.brand.brandName
        }
      }));
  
      return result;
  
    } catch (error) {
      console.log(error);
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}

