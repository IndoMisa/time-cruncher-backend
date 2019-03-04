import { Task } from '../task.entity';
import { classToPlain, plainToClass } from 'class-transformer';
import { Allow, IsArray, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto{
  constructor(task: Task){
    Object.assign(this, plainToClass(CreateTaskDto, classToPlain(task)));
  }
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Allow()
  dueTime: string;

  @IsNumber()
  groupId: number;

  @IsNumber()
  creatorId: number;

  @IsArray()
  assignedUserIds: number[];
}