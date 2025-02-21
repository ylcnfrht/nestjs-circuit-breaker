/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import axios from 'axios';

import { CircuitBreaker, CircuitBreakerLevel } from 'easy-circuit-breaker';

@Injectable()
export class OrderService {
  private readonly circuitBreaker: CircuitBreaker;
  private readonly logger = new Logger(OrderService.name);

  constructor() {
    this.circuitBreaker = new CircuitBreaker({
      timeout: () => {
        this.logger.error('Circuit Breaker is timeout');
      },
      failure: () => {
        this.logger.error('Circuit Breaker is failure');
      },
      reject: () => {
        this.logger.error('Circuit Breaker is reject');
      },
    });
  }
  private readonly stockServiceUrl = 'http://localhost:3001/stocks';

  async checkStock(productId: number): Promise<{ available: boolean }> {
    const response = await axios.get(`${this.stockServiceUrl}/${productId}`);
    return response.data;
  }

  async checkStockFallbackFunction() {
    return { available: true };
  }

  async createOrder(productId: number) {
    try {
      const result: { available: boolean } = await this.circuitBreaker.execute({
        level: CircuitBreakerLevel.Endpoint,
        requestFn: this.checkStock.bind(this),
        // fallbackFn: this.checkStockFallbackFunction.bind(this),
        name: 'checkStock',
        args: [productId],
      });

      if (result?.available) {
        return { message: 'Order placed successfully!' };
      } else {
        throw new HttpException('Product is out of stock', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException('Service Unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
