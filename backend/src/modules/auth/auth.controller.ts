import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserDocument } from '../../schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Yeni kullanıcı kaydı' })
  @ApiResponse({ status: 201, description: 'Kayıt başarılı' })
  @ApiResponse({ status: 409, description: 'E-posta zaten kayıtlı' })
  async register(@Body() registerDto: RegisterDto) {
    const { user, tokens } = await this.authService.register(registerDto);
    return {
      success: true,
      message: 'Kayıt başarılı',
      data: {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Kullanıcı girişi' })
  @ApiResponse({ status: 200, description: 'Giriş başarılı' })
  @ApiResponse({ status: 401, description: 'Hatalı kimlik bilgileri' })
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const { user, tokens } = await this.authService.login(loginDto);
    return {
      success: true,
      message: 'Giriş başarılı',
      data: {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Token yenileme' })
  @ApiResponse({ status: 200, description: 'Token yenilendi' })
  async refresh(@GetUser() user: any, @Body() refreshTokenDto: RefreshTokenDto) {
    const tokens = await this.authService.refreshTokens(user.sub, refreshTokenDto.refreshToken);
    return {
      success: true,
      message: 'Token yenilendi',
      data: tokens,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Çıkış yap' })
  async logout(@GetUser() user: UserDocument) {
    await this.authService.logout((user as any)._id.toString());
    return {
      success: true,
      message: 'Başarıyla çıkış yapıldı',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Giriş yapan kullanıcı bilgileri' })
  @ApiResponse({ status: 200, description: 'Kullanıcı bilgileri' })
  async getMe(@GetUser() user: UserDocument) {
    const freshUser = await this.authService.getMe((user as any)._id.toString());
    return {
      success: true,
      data: freshUser,
    };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Şifre değiştir' })
  async changePassword(
    @GetUser() user: UserDocument,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(
      (user as any)._id.toString(),
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
    return {
      success: true,
      message: 'Şifreniz başarıyla değiştirildi',
    };
  }

  // Google OAuth
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google ile giriş başlat' })
  async googleAuth() {
    // Redirect to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const { user, tokens } = await this.authService.googleLogin(req.user);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:4200');
    // Redirect to Angular app with tokens
    res.redirect(
      `${frontendUrl}/auth/google-callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
    );
  }
}
