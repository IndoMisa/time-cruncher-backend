import { Column, CreateDateColumn, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/user.entity';
import { Group } from '../../group/group.entity';
import { Comment } from '../../comment/comment.entity';
import { classToPlain, Exclude, plainToClass } from 'class-transformer';
import { Task } from '../task.entity';

export class TaskInfoDto{
  constructor(task: Task){
    Object.assign(this, plainToClass(TaskInfoDto, classToPlain(task)));
  }

  id: number;

  name: string;

  description: string;

  publishTime: string;

  dueTime: string;

  completionTime: string;

  isCompleted: boolean;

  creatorName: string;
  @Exclude()
  creator: number;
  @Exclude()
  group: number;
  @Exclude()
  assignedUsers: User[];
  @Exclude()
  comments: Comment[];
}