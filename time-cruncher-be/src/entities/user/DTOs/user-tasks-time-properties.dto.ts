import { IsDateString, IsNumber, IsString } from 'class-validator';

export class UserTasksTimePropertiesDto{
  @IsString()
  userId: number;
  @IsDateString()
  dateString: string;
}