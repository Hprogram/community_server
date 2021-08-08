import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path/posix';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('join')
  async Join(@Req() req, @Res() res) {
    const joinUser: any = await this.usersService.join(req.body);

    if (joinUser !== undefined) {
      // 회원가입 완료되면
      res.status(200).send({ data: 'OK' });
    }
  }

  @Post('login')
  async Login(@Req() req, @Res() res) {
    const loginUser: any = await this.usersService.login(req.body);

    if (loginUser) {
      res.status(200).send(loginUser);
    }
  }
}
