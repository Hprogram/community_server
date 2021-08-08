import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Board } from './board.entity';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Board]),
    JwtModule.register({
      secret: '10',
      signOptions: { expiresIn: '500s' },
    }),
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
