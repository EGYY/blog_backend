import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @HttpCode(200)
  @Auth()
  @Post('subscribe/:authorId')
  async subscribe(
    @CurrentUser('id') userId: string,
    @Param('authorId') authorId: string,
  ) {
    return this.subscriptionsService.subscribe(userId, authorId);
  }

  @HttpCode(200)
  @Auth()
  @Delete('unsubscribe/:authorId')
  async unsubscribe(
    @CurrentUser('id') userId: string,
    @Param('authorId') authorId: string,
  ) {
    return this.subscriptionsService.unsubscribe(userId, authorId);
  }

  @Get('followers/:userId')
  async getFollowers(@Param('userId') userId: string) {
    return this.subscriptionsService.getFollowers(userId);
  }

  @Get('following/:userId')
  async getFollowing(@Param('userId') userId: string) {
    return this.subscriptionsService.getFollowing(userId);
  }
}
