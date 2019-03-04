import { Column, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/user.entity';
import { Task } from '../../task/task.entity';
import { classToPlain, Exclude, plainToClass } from 'class-transformer';
import { Group } from '../group.entity';

export class GroupInfoDto{
  constructor(group: Group){
    Object.assign(this, plainToClass(GroupInfoDto, classToPlain(group)));
  }
  id: number;

  name: string;

  description: string;

  isPrivate: boolean;

  @Exclude()
  users: User[];
  @Exclude()
  tasks: Task[];
}