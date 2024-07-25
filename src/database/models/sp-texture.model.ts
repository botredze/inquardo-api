import { Model, Table, DataType, Column, HasOne } from 'sequelize-typescript';
import { Product } from './product.model';

@Table({})
export class spTextureModel extends Model<spTextureModel> {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    texture_name: string;

    @HasOne(() => Product)
    product: Product;
}
