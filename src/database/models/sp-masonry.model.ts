import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne, BelongsToMany } from 'sequelize-typescript';
import { SpBrand } from './sp-brand.model';
import { Product } from './product.model';
import { ProductMasonry } from './product-masonty.model';

@Table({ tableName: 'sp_masonry' })
export class SpMasonry extends Model<SpMasonry> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  masonry_name: string;

  @BelongsToMany(() => Product, { through: () => ProductMasonry })
  products: Product[];

}
