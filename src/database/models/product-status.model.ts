import { Table, Column, Model, ForeignKey, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import { Product } from './product.model';

@Table({ tableName: 'product_status' })
export class ProductStatus extends Model<ProductStatus> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  status: string;

  @HasMany(() => Product)
  products: Product[];
}
