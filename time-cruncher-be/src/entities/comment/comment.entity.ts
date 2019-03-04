import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';

@Entity()
export class Comment{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: '1000',
    nullable: false,
  })
  text: string;

  @CreateDateColumn({
    type: 'datetime',
  })
  postTime: string;

  @ManyToOne(type => User, user => user.createdComments, {eager: true, nullable: false, onDelete: 'CASCADE'})
  @JoinColumn()
  creator: User;

  @ManyToOne(type => Task, task => task.creator, {eager: true, nullable: false, onDelete: 'CASCADE'})
  @JoinColumn()
  task: Task;
}