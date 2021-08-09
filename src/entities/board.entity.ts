import { Likes } from 'src/entities/like.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('BOARD')
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; // 제목

  @Column()
  content: string; // 내용

  @Column()
  like: number; // 좋아요

  @CreateDateColumn() // 생성 시간
  createdAt: string;

  @ManyToOne(() => User, (user) => user.boards, { onDelete: 'CASCADE' })
  userId: User;

  @OneToMany((type) => Likes, (likes) => likes.board, { cascade: true })
  likes!: number[];
}
