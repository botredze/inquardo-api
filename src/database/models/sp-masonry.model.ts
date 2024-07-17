import { Table, Column, Model, DataType, } from 'sequelize-typescript';

@Table({ tableName: 'sp_masonry' })
export class SpMasonry extends Model<SpMasonry> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  masonry_name: string;
}
