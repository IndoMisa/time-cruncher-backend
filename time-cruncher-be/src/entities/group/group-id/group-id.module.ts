import { Module } from '@nestjs/common';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Group } from '../group.entity';
import { GroupIdController } from './group-id.controller';
import { TaskService } from '../../task/task.service';
import { Task } from '../../task/task.entity';
import { GroupService } from '../group.service';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Group, Task, User])],
  controllers: [GroupIdController],
  providers: [TaskService, GroupService, UserService],
})
export class GroupIdModule {}
