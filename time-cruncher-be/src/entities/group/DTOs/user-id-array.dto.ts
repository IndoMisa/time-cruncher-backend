import { IsArray } from 'class-validator';

export class UserIdArrayDto{
  @IsArray()
  userIds: number[];
}