import { Body, Controller, Get, NotFoundException, Param, Put, UseGuards } from '@nestjs/common';
import { TaskService } from '../../task/task.service';
import { GroupService } from '../group.service';
import { UserService } from '../../user/user.service';
import { UserIdArrayDto } from '../DTOs/user-id-array.dto';
import { Group } from '../group.entity';
import { TaskInfoDto } from '../../task/DTOs/task-info.dto';
import { GroupWithUsersDto } from '../DTOs/group-with-users.dto';
import { UserInfoDto } from '../../user/DTOs/user-info.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('groups/:groupId')
@UseGuards(AuthGuard('bearer'))
export class GroupIdController {
  constructor(
              private readonly taskService: TaskService,
              private readonly groupService: GroupService,
  ){}
  @Put('addUsers')
  async addUsersToGroup(@Body() body: UserIdArrayDto, @Param() params): Promise<GroupWithUsersDto>{
    const res: Group = await this.groupService.addUsersToGroup(params.groupId, body.userIds);
    return new GroupWithUsersDto(res);
  }
  @Get('tasks')
  async getTasksForGroup(@Param() params): Promise<TaskInfoDto[]>{
    const res: Group = await this.groupService.findByIdWithTasks(params.groupId);
    return res.tasks.map( x => new TaskInfoDto(x));
  }
  @Get('users')
  async getUsersForGroup(@Param() params): Promise<UserInfoDto[]>{
    const res: Group = await this.groupService.findByIdWithUsers(params.groupId);
    return res.users.map( x => new UserInfoDto(x));
  }
}
