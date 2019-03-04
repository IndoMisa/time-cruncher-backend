import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Group } from '../../group/group.entity';
import { Task } from '../../task/task.entity';
import { UserIdController } from './user-id.controller';
import { UserService } from '../user.service';
import { GroupService } from '../../group/group.service';
import { TaskService } from '../../task/task.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Group, Task])],
  controllers: [UserIdController],
  providers: [UserService, GroupService, TaskService],
})
export class UserIdModule {}
