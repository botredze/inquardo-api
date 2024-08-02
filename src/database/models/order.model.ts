import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from './user.model';
import { OrderItem } from './order-item.model';
import { Basket } from './basket.model';

@Table({ tableName: 'orders' })
export class Order extends Model<Order> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @ForeignKey(() => Basket)
  @Column({ type: DataType.INTEGER, allowNull: false })
  basketId: number;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  orderDate: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  status: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  totalPrice: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Basket)
  basket: Basket;

  @HasMany(() => OrderItem)
  items: OrderItem[];
}
