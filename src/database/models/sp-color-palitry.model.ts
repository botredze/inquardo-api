import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { SpBrand } from './sp-brand.model';

@Table({ tableName: 'sp_color_palitry' })
export class SpColorPalitry extends Model<SpColorPalitry> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  color: string;

  @ForeignKey(() => SpBrand)
  @Column({ type: DataType.INTEGER, allowNull: false })
  brandId: number;

  @BelongsTo(() => SpBrand)
  brand: SpBrand;

  @Column({ type: DataType.INTEGER, allowNull: true })
  position: number;
}
