import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'argon2';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileService } from 'src/file/file.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async getById(id: string, subscriberId?: string) {
    const subscribed = await this.prisma.subscription.findFirst({
      where: {
        followerId: id,
        followingId: subscriberId,
      },
    });
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: {
        password: true,
      },
      include: {
        _count: {
          select: {
            articles: true,
            comments: true,
            likes: true,
            followers: true,
            following: true,
          },
        },
        articles: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    if (subscribed) {
      return { ...user, subscribed: Boolean(subscribed) };
    }
    return user;
  }

  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async create(dto: AuthDto) {
    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: await hash(dto.password),
      },
    });
  }

  async update(
    userId: string,
    dto: UpdateUserDto,
    avatar?: Express.Multer.File,
  ) {
    const user = await this.getById(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.getByEmail(dto.email);
      if (emailExists) {
        throw new BadRequestException('Этот email уже используется');
      }
    }

    let avatarUrl = user.avatar;
    if (avatar) {
      try {
        const [fileResponse] = await this.fileService.saveFiles(
          [avatar],
          'avatars',
        );
        avatarUrl = fileResponse.url;
      } catch {
        throw new BadRequestException('Ошибка при загрузке аватара');
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto?.name ?? user.name,
        email: dto.email ?? user.email,
        avatar: avatarUrl,
        bio: dto?.bio ?? user?.bio,
      },
      omit: {
        password: true,
      },
    });
  }
}
