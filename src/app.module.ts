import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Board } from './entities/board.entity';
import { BoardsModule } from './boards/boards.module';
import { Likes } from './entities/like.entity';
import { User } from './entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'community_data',
      entities: [User, Board, Likes], // 사용할 entity의 클래스명을 넣어둔다.
      synchronize: true, // false로 해두는 게 안전하다.
    }),
    BoardsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
