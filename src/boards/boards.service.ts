import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Board } from './board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Board)
    private boardsRepository: Repository<Board>,
    private jwtService: JwtService,
  ) {
    this.usersRepository = usersRepository;
    this.boardsRepository = boardsRepository;
    this.jwtService = jwtService;
  }

  async tokenVerify(token: any): Promise<any> {
    const TOKEN_SECRET_KEY = '10';

    let data;

    try {
      data = await this.jwtService.verify(token, {
        secret: TOKEN_SECRET_KEY,
      });
    } catch {
      throw new HttpException('인증 정보가 유효하지 않습니다.', 401);
    }

    return data;
  }

  async posting(reqData: any): Promise<any> {
    const { email, title, content } = reqData;
    const user: User = await this.usersRepository.findOne({
      email: email,
    });

    if (!title) {
      throw new HttpException('제목을 작성해주세요', 400);
    } else if (title.length > 30) {
      throw new HttpException('제목을 30자 이내로 작성해주세요', 403);
    } else if (!content) {
      throw new HttpException('내용을 작성해주세요', 400);
    } else {
      const postData: any = {
        userId: user.id,
        user: {
          nickname: user.nickname,
        },
        title: title,
        content: content,
        like: 0,
      };

      const result: any = await this.boardsRepository.save(postData);

      //   const result: any = await this.boardsRepository.findOne({
      //     where: {
      //       id: success.id,
      //     },
      //     relations: ['userId'],
      //   });

      return result;
    }
  }
}
