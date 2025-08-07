import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private jwt: JwtService,
    private userSerivce: UserService,
    private configService: ConfigService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = this.generateTokens(user.id);
    return { user, ...tokens };
  }

  async registrate(dto: AuthDto) {
    const user = await this.userSerivce.getByEmail(dto.email);
    if (user)
      throw new BadRequestException(
        `Пользователь с такой почтой уже существует`,
      );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...newUser } = await this.userSerivce.create(dto);
    const tokens = this.generateTokens(newUser.id);
    return { user: newUser, ...tokens };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync<User>(refreshToken);
    if (!result) throw new UnauthorizedException('Невалидный refresh токен');
    const user = await this.userSerivce.getById(result.id);
    if (user?.id) {
      const tokens = this.generateTokens(user.id);
      return { user, ...tokens };
    }
  }

  generateTokens(userId: string) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, { expiresIn: '1h' });
    const refreshToken = this.jwt.sign(data, { expiresIn: '7d' });
    return {
      accessToken,
      refreshToken,
    };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userSerivce.getByEmail(dto.email);

    if (!user) throw new NotFoundException('Пользователь не найден');
    const isPasswordValid = await verify(user.password, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }
    return user;
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);
    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: expiresIn,
      secure: true,
      sameSite: 'lax',
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: new Date(0),
      secure: true,
      sameSite: 'lax',
    });
  }
}
