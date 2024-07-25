import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';
import { Category } from './category.model';
import { Product } from './product.model';
import { SpMasonry } from './sp-masonry.model';
import { SpSizeRate } from './sp-size-rate.model';
import { SpColorPalitry } from './sp-color-palitry.model';
import { spCoatingModel } from './sp-coating.model';

@Table({ tableName: 'sp_brands' })
export class SpBrand extends Model<SpBrand> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  brandName: string;

  @HasMany(() => Category)
  categories: Category[];

  @HasMany(() => Product)
  products: Product[];

  @HasMany(() => spCoatingModel)
  coatings: spCoatingModel[];

  @HasMany(() => SpMasonry)
  masonries: SpMasonry[];

  @HasMany(() => SpSizeRate)
  sizes: SpSizeRate[];

  @HasMany(() => SpColorPalitry)
  colors: SpColorPalitry[];

}
