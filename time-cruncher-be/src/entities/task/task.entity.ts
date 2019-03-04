import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Group } from '../group/group.entity';
import {Comment} from '../comment/comment.entity';

@Entity()
export class Task{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @CreateDateColumn({
    type: 'datetime',
  })
  publishTime: string;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  dueTime: string;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  completionTime: string;

  @Column({
    nullable: false,
  })
  isCompleted: boolean;

  @ManyToOne(type => User, user => user.createdTasks, {onDelete: 'CASCADE'})
  @JoinColumn()
  creator: User;

  @ManyToOne(type => Group, group => group.tasks, {onDelete: 'CASCADE'})
  @JoinColumn()
  group: Group;

  @ManyToMany(type => User, user => user.assignedTasks)
  assignedUsers: User[];

  @OneToMany(type => Comment, comment => comment.task)
  comments: Comment[];

  @ManyToOne(type => User, user => user.executedTasks)
  executor: User;
}