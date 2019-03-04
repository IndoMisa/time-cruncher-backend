import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateGroupDto{
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  isPrivate: boolean;

  @IsNumber()
  creatorId: number;

  @IsArray()
  memberEmails: string[];
}