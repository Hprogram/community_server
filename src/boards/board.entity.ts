import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('BOARD')
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; // 제목

  @Column()
  content: string; // 내용

  @Column()
  like: string; // 좋아요

  @CreateDateColumn() // 생성 시간
  createdAt: string;

  @ManyToOne(() => User, (user) => user.boards)
  user: User;
}
