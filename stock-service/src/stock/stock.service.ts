import { Injectable, Param } from '@nestjs/common';

@Injectable()
export class StockService {
  private readonly stockData = [
    { productId: 1, productName: 'Product 1', stock: 5 },
    { productId: 2, productName: 'Product 2', stock: 0 },
    { productId: 3, productName: 'Product 3', stock: 10 },
  ];

  async checkStock(@Param('productId') productId: number) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const product = this.stockData.find((p) => p.productId === Number(productId));

    if (!product) {
      return { message: 'Product not found', available: false };
    }

    return { available: product.stock > 0 };
  }
}
