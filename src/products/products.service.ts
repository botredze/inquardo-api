import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Product } from "../database/models/product.model";
import { CreateProductDto } from "./dto/create-product.dto";
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

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
    @InjectModel(ProductColor) private readonly productColorModel: typeof ProductColor,
    @InjectModel(ProductSize) private readonly productSizeModel: typeof ProductSize,
    @InjectModel(ProductRecommendation) private readonly productRecommendationModel: typeof ProductRecommendation,
    @InjectModel(ProductPhoto) private readonly productPhotoModel: typeof ProductPhoto,
    @InjectModel(Rating) private readonly ratingModel: typeof Rating,
    @InjectModel(ViewUserHistory) private viewUserHistoryModel: typeof ViewUserHistory,
    @InjectModel(SpMasonry) private productMasonryModel: typeof SpMasonry,
    private readonly s3Service: S3Service
  ) {
  }

  generateArticul() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    let result = "";
    for (let i = 0; i < 3; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 7; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return result;
  }

  async createProduct(data: CreateProductDto, files: Express.Multer.File[]): Promise<Product> {
    console.log(data);
    const { colors, sizes, recommendations, photos, masonries, ...productData } = data;

    const details = {
      description: data["details.description"],
      material: data["details.material"],
      country: data["details.country"]
    };

    try {
      const product = await this.productModel.create({
        ...productData,
        textureId: data.textureId,
        statusId: data.statusId,
        saleTypeId: data.saleTypeId,
        coatingId: data.coatingId,
      });

      await this.ratingModel.create({ productId: product.id, rate: 10 });


      if (colors && colors.length > 0) {
        await this.productColorModel.bulkCreate(
          colors.map(colorId => ({ productId: product.id, colorId }))
        );
      }

      if (sizes && sizes.length > 0) {
        await this.productSizeModel.bulkCreate(
          sizes.map(sizeId => ({ productId: product.id, sizeId }))
        );
      }

      if (recommendations && recommendations.length > 0) {
        await this.productRecommendationModel.bulkCreate(
          recommendations.map(recommendedProductId => ({
            productId: product.id,
            recommendedProductId
          }))
        );
      }

      if (masonries && masonries.length > 0) {
        await this.productMasonryModel.bulkCreate(
          masonries.map(masonryId => ({
            productId: product.id,
            masonryId
          }))
        );
      }

      if (files && files.length > 0) {
        const photoUploads = await Promise.all(files.map(file =>
          this.s3Service.uploadFile(file, "inquadro-bucket", `products/${product.id}/${file.originalname}`)
        ));

        await this.productPhotoModel.bulkCreate(
          photoUploads.map((url, index) => ({
            productId: product.id,
            url,
            main: index === 0
          }))
        );
      } else if (photos && photos.length > 0) {
        await this.productPhotoModel.bulkCreate(
          photos.map((url, index) => ({
            productId: product.id,
            url,
            main: index === 0
          }))
        );
      }

      return product;
    } catch (error) {
      console.log("error", error);
      throw new HttpException("Failed to create product", HttpStatus.INTERNAL_SERVER_ERROR);
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
      const { categoryId, sizeId, colorIds, priceMin, priceMax, collectionIds, masonryTypes, coatings, sorting } = filters;

      const where: any = {};

      console.log(categoryId, sizeId, colorIds, priceMin, priceMax, collectionIds, masonryTypes, coatings, sorting);

      if (categoryId !== undefined) {
        where.categoryId = categoryId;
      }

      if (sizeId !== undefined) {
        where["$sizes.sizeId$"] = sizeId;
      }

      if (colorIds && colorIds.length > 0) {
        where["$colors.colorId$"] = { [Op.in]: colorIds };
      }

      if (priceMin !== undefined || priceMax !== undefined) {
        where.price = {};
        if (priceMin !== undefined) {
          where.price[Op.gte] = priceMin;
        }
        if (priceMax !== undefined) {
          where.price[Op.lte] = priceMax;
        }
      }

      if (collectionIds && collectionIds.length > 0) {
        where.brandId = { [Op.in]: collectionIds };
      }

      if (masonryTypes && masonryTypes.length > 0) {
        where["$masonries.id$"] = { [Op.in]: masonryTypes };
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

      const products = await Product.findAll({
        where,
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
            model: ProductSize,
            attributes: ["sizeId"],
            include: [{ model: SpSizeRate, attributes: ["id", "sizeName"] }]
          },
          {
            model: ProductColor,
            attributes: ["colorId"],
            include: [{ model: SpColorPalitry, attributes: ["id", "color"] }]
          },
          { association: "brand" },
          { association: "photos" },
          {
            model: SpMasonry,
            attributes: ["id", "masonryType"],
            through: { attributes: [] }
          },
          {
            model: spCoatingModel,
            attributes: ["id", "coating_name"],
            through: { attributes: [] },
            where: { id: { [Op.in]: coatings } }
          }
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

      const result = {
        products: products.map(product => ({
          ...product.get(),
          colors: product.colors.map(color => ({ id: color.colorId, color: color.color.color })),
          sizes: product.sizes.map(size => ({ id: size.sizeId, sizeName: size.size.sizeName })),
          coating: product.coating ? { id: product.coating.id, coating_name: product.coating.coating_name } : null,
        })),
        minPrice,
        maxPrice
      };

      return result;

    } catch (error) {
      console.log(error);
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}


