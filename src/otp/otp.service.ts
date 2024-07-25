import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UserRepository } from '../users/user.repository';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class OtpService {
  private readonly apiUrl: string = 'https://zvonok.com/manager/cabapi_external/api/v1/phones/tellcode/';
  private readonly publicKey: string;
  private readonly campaignId: string;

  constructor(
    private readonly userRepository: UserRepository,
  ) {
    this.publicKey = process.env.ZVONOK_PUBLIC_KEY;
    this.campaignId = process.env.ZVONOK_CAMPAIGN_ID;
  }

  async generateAndSendOTP(phone: string): Promise<void> {
    const otp = this.generateOTP();
    try {
      await this.sendOTP(phone, otp);
      await this.saveOTP(phone, otp);
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Error sending OTP');
    }
  }

  private generateOTP(): string {
    const min = 1000;
    const max = 9999;
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
  }

  async sendOTP(phone: string, otp: string): Promise<void> {
    const formData = new URLSearchParams();
    formData.append('public_key', this.publicKey);
    formData.append('phone', phone);
    formData.append('campaign_id', this.campaignId);
    formData.append('pincode', otp);

    try {
      const response = await axios.post(this.apiUrl, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (response.data.status !== 'ok') {
        throw new Error(`API responded with status: ${response.data.status}`);
      }
    } catch (error) {
      console.error('Error sending OTP via API:', error);
      throw new Error('Error sending OTP via API');
    }
  }

  private async saveOTP(phone: string, otp: string): Promise<void> {
    await this.userRepository.createUser({ otp, phone });
  }

  async verifyOTP(phone: string, otp: string): Promise<boolean> {
    const user = await this.userRepository.findByPhone(phone);
    return !!user && user.otp === otp;
  }
}
