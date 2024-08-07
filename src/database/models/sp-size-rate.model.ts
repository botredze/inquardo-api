import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { SpBrand } from './sp-brand.model';

@Table({ tableName: 'sp_size_rate' })
export class SpSizeRate extends Model<SpSizeRate> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  sizeName: string;

  @ForeignKey(() => SpBrand)
  @Column({ type: DataType.INTEGER, allowNull: false })
  brandId: number;

  @BelongsTo(() => SpBrand)
  brand: SpBrand;

  @Column({ type: DataType.INTEGER, allowNull: true })
  position: number;
}
