import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserDocument } from '../../schemas/user.schema';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Kullanıcının kendi profil bilgilerini getirir' })
  async getProfile(@GetUser() user: UserDocument) {
    const profile = await this.usersService.findById((user as any)._id.toString());
    return { success: true, data: profile };
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Kullanıcı profilini günceller' })
  async updateProfile(
    @GetUser() user: UserDocument,
    @Body() dto: UpdateProfileDto,
  ) {
    const updated = await this.usersService.updateProfile(
      (user as any)._id.toString(),
      dto,
    );
    return { success: true, message: 'Profil güncellendi', data: updated };
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Kullanıcı profil fotoğrafını yükler' })
  async updateAvatar(
    @GetUser() user: UserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updated = await this.usersService.updateAvatar(
      (user as any)._id.toString(),
      file,
    );
    return { success: true, message: 'Profil fotoğrafı güncellendi', data: updated };
  }
}
