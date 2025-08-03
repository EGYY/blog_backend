import { UseGuards } from '@nestjs/common';
import { OptionalAuthGuard } from '../guards/optional-auth.guard';

export const OptionalAuth = () => UseGuards(OptionalAuthGuard);
