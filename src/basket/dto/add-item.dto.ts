
export class AddItemDto {
  readonly productId: number;
  readonly colorId?: number;
  readonly sizeId?: number;
  readonly count: number;
}
