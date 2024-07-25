import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DaDataService {
  private readonly apiUrl: string = 'https://cleaner.dadata.ru/api/v1/clean/address';
  private readonly token: string;
  private readonly secretKey: string;

  constructor(private configService: ConfigService) {
    this.token = this.configService.get<string>('DADATA_TOKEN');
    this.secretKey = this.configService.get<string>('SECRET_KEY');
  }

  async cleanAddress(address: string) {
    const options = {
      method: 'POST',
      url: this.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Token ${this.token}`,
        'X-Secret': this.secretKey,
      },
      data: JSON.stringify([address]),
    };

    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      console.error('Error cleaning address:', error);
      throw new Error('Failed to clean address');
    }
  }
}
