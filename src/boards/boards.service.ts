import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Likes } from 'src/entities/like.entity';

import { User } from 'src/entities/user.entity';
import { getRepository, Repository } from 'typeorm';
import { Board } from '../entities/board.entity';
import { config } from 'dotenv';

config();

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Board)
    private boardsRepository: Repository<Board>,
    @InjectRepository(Likes)
    private likesRepository: Repository<Likes>,
    private jwtService: JwtService,
  ) {
    this.usersRepository = usersRepository;
    this.boardsRepository = boardsRepository;
    this.likesRepository = likesRepository;
    this.jwtService = jwtService;
  }

  // 토큰 복호화
  async tokenVerify(token: any): Promise<any> {
    const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET;
    let data;

    try {
      data = await this.jwtService.verify(token, {
        secret: TOKEN_SECRET_KEY,
      });
      const post = await this.usersRepository.findOne({ email: data.email });
      data.id = post.id;
    } catch {
      return false;
    }

    return data;
  }

  // 게시글 작성
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
      let postData: any = {
        userId: user.id,
        user: {
          nickname: user.nickname,
        },
        title: title,
        content: content,
        like: 0,
      };

      const postSave: any = await this.boardsRepository.save(postData);

      postData = {
        id: postSave.id,
        userId: user.id,
        user: {
          nickname: user.nickname,
        },
        title: title,
        content: content,
        like: 0,
        createdAt: postSave.createdAt,
      };

      return postData;
    }
  }

  // 모든 게시글 조회
  async allPosts(): Promise<any> {
    const allpost = await this.boardsRepository.find({
      relations: ['userId'],
    });

    const result: any[] = [];

    allpost.forEach((el) => {
      let post = {
        id: el.id,
        userId: el.userId.id,
        user: {
          nickname: el.userId.nickname,
        },
        title: el.title,
        content: el.content,
        like: el.like,
        createdAt: el.createdAt,
      };
      result.push(post);
    });

    return result;
  }

  // 한개의 게시물 조회
  async onePosts(postId: number): Promise<any> {
    const onepost = await this.boardsRepository.findOne({
      where: {
        id: postId,
      },
      relations: ['userId'],
    });

    // if (!onepost) {
    //   throw new HttpException('해당 게시물이 존재하지 않습니다.', 404);
    // } else {
    const result = {
      id: postId,
      userId: onepost.userId.id,
      user: {
        nickname: onepost.userId.nickname,
      },
      title: onepost.title,
      content: onepost.content,
      like: onepost.like,
      isLike: false,
      createdAt: onepost.createdAt,
    };

    return result;
    // }
  }

  async likeCilck(userId: number, boardId: number): Promise<any> {
    const check = await this.likesRepository.findOne({
      user: userId,
      board: boardId,
    });

    if (check === undefined) {
      const newLike = await this.likesRepository.save({
        user: userId,
        board: boardId,
      });

      const result = await this.likesRepository.findOne({
        where: {
          id: newLike.id,
        },
        relations: ['user', 'board'],
      });

      return result;
    } else {
      return false;
    }
  }

  async likeCheck(userId: number, boardId: number): Promise<any> {
    const check = await this.likesRepository.findOne({
      user: userId,
      board: boardId,
    });

    if (check) {
      // 존재하면 true
      return true;
    } else {
      // 없으면 false
      return false;
    }
  }

  async updateLike(boardId: number): Promise<any> {
    let boardLike = await this.boardsRepository.findOne({ id: boardId });
    let count = boardLike.like + 1;
    boardLike.like = count;
    const update = await this.boardsRepository.save(boardLike);
    boardLike = await this.boardsRepository.findOne({
      where: {
        id: boardId,
      },
      relations: ['userId'],
    });

    const result = {
      id: boardLike.id,
      userId: boardLike.userId.id,
      user: {
        nickname: boardLike.userId.nickname,
      },
      title: boardLike.title,
      content: boardLike.content,
      like: boardLike.like,
      isLike: null,
      createdAt: boardLike.createdAt,
    };
    return result;
  }

  async searchBoard(boardId: number): Promise<any> {
    const boardData = await this.boardsRepository.findOne({
      where: {
        id: boardId,
      },
      relations: ['userId'],
    });

    if (boardData) {
      const result = {
        id: boardData.id,
        userId: boardData.userId.id,
        user: {
          nickname: boardData.userId.nickname,
        },
        title: boardData.title,
        content: boardData.content,
        like: boardData.like,
        isLike: null,
        createdAt: boardData.createdAt,
      };
      return result;
    } else {
      return false;
    }
  }

  async deleteBoard(boardId: number): Promise<any> {
    const deletePost = await this.boardsRepository.delete({ id: boardId });

    return {
      data: 'OK',
    };
  }
}

// connection.createQueryBuilder(Song, 'songs')
//    .leftJoinAndSelect('songs.singer', 'singer')
//    .orderBy('singer.name', 'ASC')
//    .getMany();
