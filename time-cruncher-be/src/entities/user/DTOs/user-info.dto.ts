import {IsNumber, IsString } from 'class-validator';
import { classToClass, classToPlain, Exclude, plainToClass } from 'class-transformer';
import { Group } from '../../group/group.entity';
import { JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Task } from '../../task/task.entity';
import { Comment } from '../../comment/comment.entity';
import { User } from '../user.entity';
import { AccessToken } from '../../access-token/access-token.entity';

export class UserInfoDto{

  constructor(user: User){
    // Object.assign(this, user);
    Object.assign(this, plainToClass(UserInfoDto, classToPlain(user)));
  }

  id: number;
  firstname: string;
  lastname: string;
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  groups: Group[];

  @Exclude()
  createdTasks: Task[];

  @Exclude()
  assignedTasks: Task[];

  @Exclude()
  createdComments: Comment[];

  @Exclude()
  token: AccessToken;
}