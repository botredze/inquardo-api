import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne } from 'sequelize-typescript';
import { SpBrand } from './sp-brand.model';
import { Product } from './product.model';

@Table({ tableName: 'sp_masonry' })
export class SpMasonry extends Model<SpMasonry> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  masonry_name: string;

  @ForeignKey(() => SpBrand)
  @Column({ type: DataType.INTEGER, allowNull: false })
  brandId: number;

  @BelongsTo(() => SpBrand)
  brand: SpBrand;

  @HasOne(() => Product)
  product: Product;

}
