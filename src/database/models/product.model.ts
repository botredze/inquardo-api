import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne, HasMany, BelongsToMany } from 'sequelize-typescript';
import { SpBrand } from './sp-brand.model';
import { Rating } from './rating.model';
import { BasketItem } from './basket-item.model';
import { ViewUserHistory } from './view-user-history.model';
import { ProductColor } from './product-color.model';
import { ProductSize } from './product-size.model';
import { ProductRecommendation } from './product-recommendations.model';
import { ProductPhoto } from './product-photo.model';
import { User } from "./user.model";
import { SpMasonry } from './sp-masonry.model';
import { spCoatingModel } from './sp-coating.model';
import { SpSaleTypeModel } from './sp-sale-type.model';
import { spTextureModel } from './sp-texture.model';
import { ProductStatus } from './product-status.model';
import { CollectionModel } from './collection.model';
import { FavoriteProduct } from './favorite.model';
import { SpFactureModel } from './sp_facture.model';
import { ProductMasonry } from './product-masonty.model';

@Table({ tableName: 'products' })
export class Product extends Model<Product> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  price: number;

  @Column({ type: DataType.FLOAT })
  oldPrice: number;

  @Column({ type: DataType.FLOAT })
  discount: number;

  @Column({ type: DataType.BOOLEAN })
  discountActive: boolean;

  @Column({ type: DataType.STRING, allowNull: false })
  material: string;

  @Column({ type: DataType.STRING, allowNull: false })
  country: string;

  @Column({ type: DataType.STRING, allowNull: false })
  articul: string;

  @Column({ type: DataType.STRING, allowNull: false })
  complect: string;

  @ForeignKey(() => CollectionModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  collectionId: number;

  @ForeignKey(() => SpBrand)
  @Column({ type: DataType.INTEGER, allowNull: false })
  brandId: number;

  @ForeignKey(() => spCoatingModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  coatingId: number;

  @ForeignKey(() => SpSaleTypeModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  saleTypeId: number;

  @ForeignKey(() => SpFactureModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  factureId: number;

  @ForeignKey(() => spTextureModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  textureId: number;

  @ForeignKey(() => SpMasonry)
  @Column({ type: DataType.INTEGER, allowNull: true })
  masonryId: number;

  @ForeignKey(() => ProductStatus)
  @Column({ type: DataType.INTEGER, allowNull: true })
  statusId: number;

  @BelongsTo(() => SpBrand)
  brand: SpBrand;

  @BelongsTo(() => CollectionModel)
  collection: CollectionModel;

  @BelongsTo(() => spCoatingModel)
  coating: spCoatingModel;

  @HasOne(() => Rating)
  rating: Rating;

  @HasMany(() => BasketItem)
  basketItems: BasketItem[];

  @HasMany(() => ViewUserHistory)
  viewHistories: ViewUserHistory[];

  @HasMany(() => ProductColor)
  colors: ProductColor[];

  @BelongsTo(() => SpSaleTypeModel)
  saleType: SpSaleTypeModel;

  @HasMany(() => ProductSize)
  sizes: ProductSize[];

  @HasMany(() => ProductMasonry)
  masonry: ProductMasonry[];

  @HasMany(() => ProductRecommendation)
  recommendations: ProductRecommendation[];

  @HasMany(() => ProductPhoto)
  photos: ProductPhoto[];

  @BelongsToMany(() => User, { through: { model: () => FavoriteProduct } })
  favoritedByUsers: User[];

  @BelongsTo(() => spTextureModel)
  texture: spTextureModel;

  @BelongsTo(() => ProductStatus)
  productStatus: ProductStatus;

  @BelongsTo( ()=> SpFactureModel)
  facture: SpFactureModel
}
