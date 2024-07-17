import { Table, Column, Model, ForeignKey, BelongsTo, HasMany, DataType } from 'sequelize-typescript';
import { SpBrand } from './sp-brand.model';
import { Product } from './product.model';

@Table({ tableName: 'categories' })
export class Category extends Model<Category> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  categoryName: string;

  @ForeignKey(() => SpBrand)
  @Column({ type: DataType.INTEGER, allowNull: false })
  brandId: number;

  @BelongsTo(() => SpBrand)
  brand: SpBrand;

  @HasMany(() => Product)
  products: Product[];
}
