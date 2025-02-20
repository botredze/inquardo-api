import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';
import { Product } from './product.model';
import { SpMasonry } from './sp-masonry.model';
import { SpSizeRate } from './sp-size-rate.model';
import { SpColorPalitry } from './sp-color-palitry.model';
import { spCoatingModel } from './sp-coating.model';
import { CollectionModel } from './collection.model';

@Table({ tableName: 'sp_brands' })
export class SpBrand extends Model<SpBrand> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  brandName: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  position: number;

  @HasMany(() => Product)
  products: Product[];

  @HasMany(() => spCoatingModel)
  coatings: spCoatingModel[];

  @HasMany(() => SpSizeRate)
  sizes: SpSizeRate[];

  @HasMany(() => SpColorPalitry)
  colors: SpColorPalitry[];

  @HasMany(() => CollectionModel)
  collections: CollectionModel[];

}
