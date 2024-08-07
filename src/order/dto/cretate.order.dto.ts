export class CreateOrderDto {
  readonly basketId: number;
  readonly basketItems: {
    productId: number;
    count: number;
    price: number;
  }[];
  readonly totalPrice: number;
}
