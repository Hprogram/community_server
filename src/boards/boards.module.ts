import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from 'src/entities/like.entity';
import { User } from 'src/entities/user.entity';
import { Board } from '../entities/board.entity';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Board, Likes]),
    JwtModule.register({
      secret: '10',
      signOptions: { expiresIn: '500s' },
    }),
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
