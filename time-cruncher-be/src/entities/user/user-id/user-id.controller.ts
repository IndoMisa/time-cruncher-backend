import { Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../user.service';
import { TaskService } from '../../task/task.service';
import { GroupService } from '../../group/group.service';
import { Group } from '../../group/group.entity';
import { Task } from '../../task/task.entity';
import { GroupInfoDto } from '../../group/DTOs/group-info.dto';
import { TaskInfoDto } from '../../task/DTOs/task-info.dto';
import { UserTasksTimePropertiesDto } from '../DTOs/user-tasks-time-properties.dto';
import { User } from '../user.entity';
import { UserNotFoundException } from '../../../custom-exceptions/user-not-found.exception';
import { AuthGuard } from '@nestjs/passport';
@Controller('users/:userId')
@UseGuards(AuthGuard('bearer'))
export class UserIdController {
  constructor(
    private readonly userService: UserService,
    // private readonly taskService: TaskService,
    // private readonly groupService: GroupService,
  ) {}
  @Get('groups')
  async getGroupsForUser(@Param() params): Promise<GroupInfoDto[]>{
    const user: User = await this.userService.findByIdWithGroups(params.userId);
    return user.groups.map(x => new GroupInfoDto(x));
  }
  @Get('assignedTasks')
  async getAssignedTasksForUser(@Param() params): Promise<TaskInfoDto[]>{
    const user: User = await this.userService.findByIdWithAssignedTasks(params.userId);
    return user.assignedTasks.map(x => new TaskInfoDto(x));
  }
  @Get('createdTasks')
  async getCreatedTasksForUser(@Param() params): Promise<TaskInfoDto[]>{
    const user: User = await this.userService.findByIdWithCreatedTasks(params.userId);
    return user.createdTasks.map( x => new TaskInfoDto(x));
  }
  @Get('daily')
  async getDailyAssignedTasksForUser(@Query() query, @Param() params): Promise<Task[]> {
    const refDateString = query.dateString === '' || query.dateString === undefined ? new Date().toISOString() : query.dateString;
    if (!await this.userService.existsWithId(params.userId))
      throw new UserNotFoundException(params.userId)
    const res: Task[] = await this.userService.findDailyTasksByUserId(params.userId, refDateString);
    return res;
  }
  @Get('monthly')
  async getMonthlyAssignedTasksForUser(@Param() params, @Query() query): Promise<Task[]> {
    const refDateString = query.dateString === '' || query.dateString === undefined ? new Date().toISOString() : query.dateString;
    if (!await this.userService.existsWithId(params.userId))
      throw new UserNotFoundException(params.userId);
    const res: Task[] = await this.userService.findMonthlyTasksByUserId(params.userId, refDateString);
    return res;
  }
  @Get('weekly')
  async getWeeklyAssignedTasksForUser(@Query() query, @Param() params): Promise<any>{
    const refDateString = query.dateString === '' || query.dateString === undefined ? new Date().toISOString() : query.dateString;
    if (!await this.userService.existsWithId(params.userId))
      throw new UserNotFoundException(params.userId);
    const res: Task[] = await this.userService.findWeeklyTasksByUserId(params.userId, refDateString);
    return res;
  }
  @Get('uncategorizedTasks')
  async getUncategorizedTasksFroUser(@Param() params){
    const res: Task[] = await this.userService.findUncategorizedTasks(params.userId);
    return res;
  }
}
