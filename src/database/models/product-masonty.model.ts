import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Product } from './product.model';
import { SpMasonry } from './sp-masonry.model';

@Table({ tableName: 'product_masonry' })
export class ProductMasonry extends Model<ProductMasonry> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  productId: number;

  @ForeignKey(() => SpMasonry)
  @Column({ type: DataType.INTEGER, allowNull: false })
  masonryId: number;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => SpMasonry)
  masonry: SpMasonry;
}
