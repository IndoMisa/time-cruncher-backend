import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskController } from './task.controller';
import { GroupService } from '../group/group.service';
import { Group } from '../group/group.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { TaskIdController } from './task-id/task-id.controller';
import { AccessTokenService } from '../access-token/access-token.service';
import { AccessToken } from '../access-token/access-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Group, User, AccessToken])],
  controllers: [TaskController, TaskIdController],
  providers: [TaskService, GroupService, UserService, AccessTokenService],
  exports: [TaskService],
})
export class TaskModule {}
