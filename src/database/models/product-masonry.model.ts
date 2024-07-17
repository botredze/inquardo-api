import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { Product } from './product.model';
import { SpMasonry } from './sp-masonry.model';

@Table({ tableName: 'product_masonry' })
export class ProductMasonry extends Model<ProductMasonry> {
  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true })
  productId: number;

  @ForeignKey(() => SpMasonry)
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true })
  masonryId: number;
}
