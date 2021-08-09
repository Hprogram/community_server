import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';

config();

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    this.usersRepository = usersRepository;
    this.jwtService = jwtService;
  }

  // 회원가입
  async join(joinData: any) {
    const SECRET_KEY = process.env.SALTORROUNDS;

    if (
      joinData.email === '' ||
      joinData.nickname === '' ||
      joinData.password === '' ||
      joinData.email === undefined ||
      joinData.nickname === undefined ||
      joinData.password === undefined
    ) {
      throw new HttpException('정보를 모두 입력해 주세요', 400);
    }

    const user: User = await this.usersRepository.findOne({
      email: joinData.email,
    });

    if (user) {
      throw new HttpException('해당 이메일이 이미 존재합니다.', 403);
    }

    if (joinData.nickname.length > 10) {
      throw new HttpException('닉네임이 10자를 초과합니다', 403);
    }

    let checkNum = joinData.password.search(/[0-9]/g); // 숫자사용
    let checkEng = joinData.password.search(/[a-z]/gi); // 영문사용

    if (checkNum < 0 || checkEng < 0) {
      throw new HttpException(
        '비밀번호는 숫자와 영문자를 조합하여야 합니다',
        403,
      );
    }

    //req.body.user_pawssword(즉 req요청으로 들어온 비밀번호를 해싱하는 과정)
    joinData.password = await hash(joinData.password, Number(SECRET_KEY));

    const { password, ...result }: any = await this.usersRepository.save(
      joinData,
    );
    return result;
  }

  // 로그인
  async login(loginData: any) {
    const user = await this.usersRepository.findOne({
      email: loginData.email,
    });
    const TOKEN_SECRET = process.env.TOKEN_SECRET;

    if (!user) {
      throw new HttpException('존재하지 않는 이메일입니다', 403);
    }

    let password = await compare(loginData.password, user.password);

    if (!password) {
      throw new HttpException('비밀번호가 일치하지 않습니다', 403);
    } else {
      const token = this.jwtService.sign(
        {
          email: user.email,
          nickname: user.nickname,
        },
        {
          secret: TOKEN_SECRET,
          expiresIn: '1h',
        },
      );
      return {
        token: token,
        user: { id: user.id, email: user.email, nickname: user.nickname },
      };
    }
  }
}
