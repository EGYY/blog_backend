import { Controller, Get, HttpCode} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';


@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @HttpCode(200)
  @Auth()
  @Get()
  async getNotifications(@CurrentUser('id') userId: string) {
    return this.notificationsService.getUserNotifications(userId);

  }
}
 