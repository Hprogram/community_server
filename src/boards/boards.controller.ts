import {
  ConsoleLogger,
  Controller,
  Delete,
  Get,
  HttpException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Board } from '../entities/board.entity';
import { BoardsService } from './boards.service';

@Controller('api')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  // 게시물 작성
  @Post('boards')
  async createBoard(@Req() req, @Res() res) {
    const authorization = req.headers['authorization'];
    if (authorization !== undefined && authorization.length >= 2) {
      const token = authorization.split(' ')[1];
      const verify = await this.boardsService.tokenVerify(token);

      if (verify === false) {
        throw new HttpException('인증 정보가 유효하지 않습니다.', 401);
      } else {
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
    } else {
      throw new HttpException('로그인이 필요합니다.', 401);
    }
  }

  // 게시물 리스트 조회
  @Get('boards')
  async searchBoard(@Res() res) {
    const posts = await this.boardsService.allPosts();

    if (posts) {
      res.status(200).send(posts);
    }
  }

  //게시물 상세 조회
  @Get('boards/:id')
  async searchOnePost(@Req() req, @Res() res) {
    const postId: number = req.params.id;
    const searchPost: any = await this.boardsService.searchBoard(postId);

    if (!searchPost) {
      throw new HttpException('해당 게시물이 존재하지 않습니다.', 404);
    }
    const authorization: string = req.headers['authorization'];

    // 로그인을 했을경우와 하지 않았을 경우로 나누어 작성
    if (authorization !== undefined && authorization.length >= 2) {
      const token: string = authorization.split(' ')[1];
      const verify: any = await this.boardsService.tokenVerify(token);

      if (verify !== false) {
        //로그인 했을때
        const post: any = await this.boardsService.onePosts(postId);
        post.isLike = await this.boardsService.likeCheck(verify.id, postId);
        res.status(200).send(post);
      } else {
        // 유호하지 않은 토큰일 때
        const post: any = await this.boardsService.onePosts(postId);
        res.status(200).send(post);
      }
    } else {
      // 로그인 안했을때
      const post: any = await this.boardsService.onePosts(postId);
      res.status(200).send(post);
    }
  }

  // 게시물 좋아요
  @Post('boards/:id/like')
  async newLikes(@Req() req, @Res() res) {
    const postId: number = req.params.id;
    const authorization: string = req.headers['authorization'];
    if (authorization !== undefined && authorization.length >= 2) {
      const token: string = authorization.split(' ')[1];
      const verify: any = await this.boardsService.tokenVerify(token);

      if (verify === false) {
        throw new HttpException('인증 정보가 유효하지 않습니다.', 401);
      } else {
        const likeCilck: any = await this.boardsService.likeCilck(
          verify.id, // 유저 pk
          postId, // 게시글 pk
        );

        if (likeCilck !== false) {
          const update: any = await this.boardsService.updateLike(postId);
          update.isLike = await this.boardsService.likeCheck(verify.id, postId);
          res.status(200).send(update);
        } else {
          const boardData: any = await this.boardsService.searchBoard(postId);
          boardData.isLike = await this.boardsService.likeCheck(
            verify.id,
            postId,
          );
          res.status(200).send(boardData);
        }
      }
    } else {
      throw new HttpException('로그인이 필요합니다.', 401);
    }
  }

  // 게시물 삭제
  @Delete('boards/:id')
  async deletePost(@Req() req, @Res() res) {
    const postId: number = req.params.id;
    const authorization: string = req.headers['authorization'];
    if (authorization !== undefined && authorization.length >= 2) {
      const token: string = authorization.split(' ')[1];
      const verify: any = await this.boardsService.tokenVerify(token);
      const post: any = await this.boardsService.searchBoard(postId);

      if (verify === false) {
        throw new HttpException('인증 정보가 유효하지 않습니다.', 401);
      } else if (post === false) {
        throw new HttpException('해당 게시물이 존재하지 않습니다.', 404);
      } else if (post.userId !== verify.id) {
        throw new HttpException('게시물의 작성자가 아닙니다.', 401);
      } else {
        const result = await this.boardsService.deleteBoard(postId);
        res.status(200).send(result);
      }
    } else {
      throw new HttpException('로그인이 필요합니다.', 401);
    }
  }
}
