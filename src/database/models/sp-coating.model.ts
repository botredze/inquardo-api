import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'sp_coating' })
export class spCoatingModel extends Model<spCoatingModel> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  coating_name: string;
}
