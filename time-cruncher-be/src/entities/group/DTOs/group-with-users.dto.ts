import { Group } from '../group.entity';
import { classToPlain, Exclude, plainToClass } from 'class-transformer';
import { User } from '../../user/user.entity';
import { Task } from '../../task/task.entity';

export class GroupWithUsersDto{
  constructor(group: Group){
    Object.assign(this, plainToClass(GroupWithUsersDto, classToPlain(group)));
  }
  id: number;

  name: string;

  description: string;

  isPrivate: boolean;

  users: User[];
  @Exclude()
  tasks: Task[];
}