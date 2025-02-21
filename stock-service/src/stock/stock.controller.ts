import { Controller, Get, Param } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get(':productId')
  checkStock(@Param('productId') productId: number) {
    return this.stockService.checkStock(productId);
  }
}
