import { Model, Table, DataType,Column} from "sequelize-typescript";

@Table({})
export class spTextureModel extends Model<spTextureModel> {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    texture_name: string;
}