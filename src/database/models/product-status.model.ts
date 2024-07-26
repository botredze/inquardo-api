// product-status.model.ts

import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import { Product } from './product.model';

@Table({ tableName: 'product_status' })
export class ProductStatus extends Model<ProductStatus> {
  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
  productId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  status: string;

}
