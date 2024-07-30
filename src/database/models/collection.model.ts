import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { SpBrand } from './sp-brand.model';
import { Product } from './product.model';

@Table({ tableName: 'collections' })
export class CollectionModel extends Model<CollectionModel> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  collectionName: string;

  @ForeignKey(() => SpBrand)
  @Column({ type: DataType.INTEGER, allowNull: false })
  brandId: number;

  @BelongsTo(() => SpBrand)
  brand: SpBrand;

  @HasMany(() => Product)
  products: Product[];
}
