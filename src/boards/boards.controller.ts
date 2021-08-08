import {
  ConsoleLogger,
  Controller,
  HttpException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('api')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post('boards')
  async createBoard(@Req() req, @Res() res) {
    const authorization = req.headers['authorization'];
    const token = authorization.split(' ')[1];

    const verify = await this.boardsService.tokenVerify(token);

    const { title, content } = req.body;

    const reqData = {
      title: title,
      content: content,
      email: verify.email,
    };

    const post = await this.boardsService.posting(reqData);

    if (post) {
      res.status(200).send(post);
    }
  }

  @Post('login')
  async Login(@Req() req, @Res() res) {}
}
