import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Product } from "../database/models/product.model";
import { CreateProductDto } from "./dto/create-product.dto";
import { Category } from "../database/models/category.model";
import { SpBrand } from "../database/models/sp-brand.model";
import { ProductColor } from "../database/models/product-color.model";
import { ProductSize } from "../database/models/product-size.model";
import { ProductRecommendation } from "../database/models/product-recommendations.model";
import { Op } from "sequelize";
import { ProductDetails } from "../database/models/product-details.model";
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

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
    @InjectModel(ProductColor) private readonly productColorModel: typeof ProductColor,
    @InjectModel(ProductSize) private readonly productSizeModel: typeof ProductSize,
    @InjectModel(ProductDetails) private readonly productDetailsModel: typeof ProductDetails,
    @InjectModel(ProductRecommendation) private readonly productRecommendationModel: typeof ProductRecommendation,
    @InjectModel(ProductPhoto) private readonly productPhotoModel: typeof ProductPhoto,
    @InjectModel(Rating) private readonly ratingModel: typeof Rating,
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
    const { colors, sizes, recommendations, photos, ...productData } = data;

    const details = {
      description: data["details.description"],
      material: data["details.material"],
      country: data["details.country"]
    };

    try {
      const product = await this.productModel.create(productData);

      await this.ratingModel.create({ productId: product.id, rate: 10 });

      if (details) {
        const articul = this.generateArticul();
        await this.productDetailsModel.create({ ...details, productId: product.id, articul });
      }

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

      console.log(recommendations && recommendations.length > 1);
      if (recommendations && recommendations.length > 1) {
        await this.productRecommendationModel.bulkCreate(
          recommendations.map(recommendedProductId => ({
            productId: product.id,
            recommendedProductId
          }))
        );
      }


      if (files && files.length > 0) {
        const photoUploads = await Promise.all(files.map(file =>
          this.s3Service.uploadFile(file, "188f78bd-inquadro-bucket", `products/${product.id}/${file.originalname}`)
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


  findAll() {
    return this.productModel.findAll({
      include: [
        Category,
        SpBrand,
        ProductPhoto,
        spCoatingModel,
        SpMasonry,
        spTextureModel,
        ProductStatus
      ]
    }).then(products => {
      return products.map(product => ({
        ...product.get()
      }));
    });
  }


  async findOne(id: number) {
    return this.productModel.findByPk(id, {
      include: [
        Category,
        SpBrand,
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
                Category,
                ProductPhoto
              ]
            }
          ]
        },
        ProductPhoto,
        ProductDetails,
        spTextureModel,
        ProductStatus,
        {
          model: spCoatingModel,
          attributes: ["id", "coating_name"]
        },
        {
          model: SpMasonry,
          through: { attributes: [] },
          attributes: ["id", "masonry_name"]
        },
        {
          model: SpSaleTypeModel,
          attributes: ["id", "type"]
        }
      ]
    }).then(product => {
      if (product) {
        return {
          ...product.get(),
          colors: product.colors.map(color => ({ id: color.colorId, color: color.color.color })),
          sizes: product.sizes.map(size => ({ id: size.sizeId, sizeName: size.size.sizeName })),
          recommendations: product.recommendations.map(rec => ({
            ...rec.recommendedProduct.get(),
            category: rec.recommendedProduct.category,
            photos: rec.recommendedProduct.photos
          })),
          coating: product.coating ? { id: product.coating.id, type: product.coating.coating_name } : null,
          masonries: product.masonries ? product.masonries.map(masonry => ({ id: masonry.id, masonryName: masonry.masonry_name })) : [],
          saleType: product.saleType ? { id: product.saleType.id, type: product.saleType.type } : null
        };
      }
      return null;
    });
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
          { association: "category" },
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
          masonryTypes: product.masonries.map(masonry => ({ id: masonry.id, masonryType: masonry.masonry_name })),
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


