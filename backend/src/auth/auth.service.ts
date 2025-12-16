import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async sendOtp(mobile: string) {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      throw new BadRequestException('Invalid mobile number');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.prisma.oTP.create({
      data: {
        mobile,
        code: otp,
        expiresAt,
      },
    });
    console.log("Generated OTP:", otp);


    return {
      success: true,
      otp, // ❗ For development only — remove later
    };
  }
  async register(data: { name: string; mobile: string; role: string }) {
  const { name, mobile, role } = data;

  const existing = await this.prisma.user.findUnique({
    where: { mobile },
  });

  if (existing) {
    throw new BadRequestException("User already exists");
  }

  const user = await this.prisma.user.create({
    data: {
      name,
      mobile,
      role,
    },
  });

  return { success: true, user };
}



  async verifyOtp(mobile: string, code: string) {
    console.log("VERIFY OTP INPUT =>", { mobile, code });

  const latestOtp = await this.prisma.oTP.findFirst({
    where: { mobile },
    orderBy: { id: 'desc' },
  });
  console.log("LATEST OTP in DB =>", latestOtp);

  if (!latestOtp) {
    throw new BadRequestException('OTP not found');
  }

  if (latestOtp.expiresAt < new Date()) {
    throw new BadRequestException('OTP expired');
  }

  if (latestOtp.code !== code) {
    throw new BadRequestException('Invalid OTP');
  }

  // ✔ User must already be registered
  const user = await this.prisma.user.findUnique({
    where: { mobile },
  });

  if (!user) {
    throw new BadRequestException(
      "User not registered. Please create an account first."
    );
  }

  // ✔ Login successful → generate JWT
  const token = this.jwt.sign({ userId: user.id });

  return {
    success: true,
    token,
    user,
  };
}


}
