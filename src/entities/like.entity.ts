import { Board } from 'src/entities/board.entity';
import { User } from 'src/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('LIKES')
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn() // 생성 시간
  createdAt: string;

  @ManyToOne((type) => Board, (board) => board.likes, { onDelete: 'CASCADE' })
  board: number;

  @ManyToOne((type) => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user: number;
}
