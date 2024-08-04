import { Table, Column, Model, DataType} from 'sequelize-typescript';

@Table({ tableName: 'sp-facture' })
export class SpFactureModel extends Model<SpFactureModel> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  facture_name: string;
}
