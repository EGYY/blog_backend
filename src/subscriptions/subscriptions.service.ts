import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribe(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new ConflictException('Вы не можете подписаться сами на себя');
    }

    const existingSubscription = await this.prisma.subscription.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingSubscription) {
      throw new ConflictException('Вы уже подписаны');
    }

    return this.prisma.subscription.create({
      data: {
        followerId,
        followingId,
      },
      include: {
        following: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async unsubscribe(followerId: string, followingId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException('Попдиска не найдена');
    }

    return this.prisma.subscription.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }

  async getFollowers(userId: string) {
    return this.prisma.subscription.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });
  }

  async getFollowing(userId: string) {
    return this.prisma.subscription.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });
  }
}
