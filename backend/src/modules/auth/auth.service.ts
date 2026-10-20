import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, AuthProvider } from '../../schemas/user.schema';
import { Business, BusinessDocument } from '../../schemas/business.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as slugify from 'slugify';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: UserDocument; tokens: AuthTokens }> {
    const { name, email, password } = registerDto;

    // Check if email already exists
    const existingUser = await this.userModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ConflictException('Bu e-posta adresi zaten kayıtlı');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await this.userModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      provider: AuthProvider.LOCAL,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Save refresh token
    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
      lastLoginAt: new Date(),
    });

    return { user, tokens };
  }

  async login(loginDto: LoginDto): Promise<{ user: UserDocument; tokens: AuthTokens }> {
    const { email, password } = loginDto;

    // Find user with password
    const user = await this.userModel.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new UnauthorizedException('E-posta veya şifre hatalı');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Hesabınız askıya alınmış. Lütfen destek ekibiyle iletişime geçin');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-posta veya şifre hatalı');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Update refresh token and last login
    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
      lastLoginAt: new Date(),
    });

    return { user, tokens };
  }

  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  async googleLogin(googleUser: any): Promise<{ user: UserDocument; tokens: AuthTokens }> {
    const { email, name, picture, googleId } = googleUser;

    let user = await this.userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create new user from Google
      user = await this.userModel.create({
        name,
        email: email.toLowerCase(),
        googleId,
        avatar: picture,
        provider: AuthProvider.GOOGLE,
        isEmailVerified: true,
      });
    } else if (!user.googleId) {
      // Link Google to existing account
      await this.userModel.findByIdAndUpdate(user._id, {
        googleId,
        provider: AuthProvider.GOOGLE,
        avatar: picture,
        isEmailVerified: true,
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Hesabınız askıya alınmış');
    }

    const tokens = await this.generateTokens(user);

    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
      lastLoginAt: new Date(),
    });

    return { user, tokens };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<AuthTokens> {
    const user = await this.userModel.findById(userId).select('+refreshToken');
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Erişim reddedildi');
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Erişim reddedildi');
    }

    const tokens = await this.generateTokens(user);

    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
    });

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userModel.findById(userId).select('+password');
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');

    if (user.provider !== AuthProvider.LOCAL) {
      throw new BadRequestException('Google hesabı ile giriş yapıldığından şifre değiştirilemez');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mevcut şifre hatalı');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.userModel.findByIdAndUpdate(userId, { password: hashedPassword });
  }

  async getMe(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');
    return user;
  }

  private async generateTokens(user: UserDocument): Promise<AuthTokens> {
    const payload: TokenPayload = {
      sub: (user._id as any).toString(),
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '30d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
