import { Task } from '../task.entity';
import { classToPlain, Exclude, plainToClass } from 'class-transformer';
import { User } from '../../user/user.entity';
import { Comment } from '../../comment/comment.entity';

export class TaskWithAssignedUsersDto{
  constructor(task: Task){
    Object.assign(this, plainToClass(TaskWithAssignedUsersDto, classToPlain(task)));
  }

  id: number;

  name: string;

  description: string;

  publishTime: string;

  dueTime: string;

  completionTime: string;

  isCompleted: boolean;
  assignedUsers: User[];

  @Exclude()
  creator: number;
  @Exclude()
  group: number
  @Exclude()
  comments: Comment[];
}