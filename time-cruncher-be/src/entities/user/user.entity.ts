import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, OneToOne } from 'typeorm';
import {Group} from '../group/group.entity';
import { Task } from '../task/task.entity';
import {Comment} from '../comment/comment.entity';
import { AccessToken } from '../access-token/access-token.entity';

@Entity()
export class User{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  firstname: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  lastname: string;

  @Column({
    type: 'varchar',
    length: 80,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @ManyToMany(type => Group, group => group.users)
  @JoinTable({
    name: 'user_group',
  })
  groups: Group[];

  @OneToMany(type => Task, task => task.creator)
  createdTasks: Task[];

  @ManyToMany(type => Task, task => task.assignedUsers)
  @JoinTable({
    name: 'task_assignment',
  })
  assignedTasks: Task[];

  @OneToMany(type => Comment, comment => comment.creator)
  createdComments: Comment[];

  @OneToOne(type => AccessToken, accessToken => accessToken.user )
  accessToken: AccessToken;

  @OneToMany(type => Task, task => task.executor)
  executedTasks: Task[];
}