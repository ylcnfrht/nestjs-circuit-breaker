import { Controller, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post(':productId')
  async createOrder(@Param('productId') productId: number) {
    return this.orderService.createOrder(Number(productId));
  }
}
