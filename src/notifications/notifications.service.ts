import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) { }

  async notifySubscribers(authorId: string, articleId: string, articleTitle: string) {
    const subscriptions = await this.prisma.subscription.findMany({
      where: { followingId: authorId },
      select: { followerId: true },
    });

    const notifications = subscriptions.map((subscription) =>
      this.prisma.notification.create({
        data: {
          userId: subscription.followerId,
          message: `Новая статья "${articleTitle}"`,
          articleId,
        },
      }),
    );

    await Promise.all(notifications);
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      omit: { articleId: true, userId: true},
      include: {
        article: {
          select: {
            id: true,
            title: true,
            subtitle: true,
            poster: true,
            createdAt: true,
          }
        }, user: {
          select: {
            id: true,
            avatar: true,
            email: true,
            name: true
          }
        }
      },
    });
  }
}