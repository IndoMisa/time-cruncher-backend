import { Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/user.entity';
import { Task } from '../../task/task.entity';
import { IsNumber, IsString } from 'class-validator';

export class CreateCommentDto{
  @IsString()
  text: string;
  @IsNumber()
  creatorId: number;
  @IsNumber()
  taskId: number;
}