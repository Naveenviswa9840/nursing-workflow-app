import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}   // <-- FIXED

  @Post('send-otp')
  sendOtp(@Body() body: { mobile: string }) {
    return this.authService.sendOtp(body.mobile);
  }

  @Post('verify-otp')
  verifyOtp(@Body() body: { mobile: string; code: string }) {
    return this.authService.verifyOtp(body.mobile, body.code);
  }

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);   // <-- Now works
  }
  
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req) {
    // req.user comes from jwt.strategy
    return req.user;
  }
}
