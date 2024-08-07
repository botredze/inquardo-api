import { Table, Column, Model, DataType} from 'sequelize-typescript';

@Table({ tableName: 'sp-sale-type' })
export class SpSaleTypeModel extends Model<SpSaleTypeModel> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  position: number;
}
