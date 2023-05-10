import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') {}
