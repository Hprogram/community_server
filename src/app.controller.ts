import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './users/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ap')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api')
  getid(): string {
    return this.appService.getHello();
  }
}
