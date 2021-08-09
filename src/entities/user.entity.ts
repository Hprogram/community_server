import { Likes } from 'src/entities/like.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from './board.entity';

@Entity('USER')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column()
  password: string;

  @OneToMany(() => Board, (board) => board.userId, { cascade: true })
  boards: Board[];

  @OneToMany((type) => Likes, (likes) => likes.user, { cascade: true })
  likes!: number[];
}
