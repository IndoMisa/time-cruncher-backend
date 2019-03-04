import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { TaskService } from '../task.service';
import { Task } from '../task.entity';
import { TaskInfoDto } from '../DTOs/task-info.dto';
import { TaskWithAssignedUsersDto } from '../DTOs/task-with-assigned-users.dto';
import { UserIdArrayDto } from '../../group/DTOs/user-id-array.dto';
import { TaskNotFoundException } from '../../../custom-exceptions/task-not-found.exception';
import {Comment} from '../../comment/comment.entity';
import { User } from '../../user/user.entity';
import { AuthGuard } from '@nestjs/passport';
@Controller('tasks/:id')
@UseGuards(AuthGuard('bearer'))
export class TaskIdController {
  constructor(private readonly taskService: TaskService){}

  @Get('comments')
  async findTaskWithComments(@Param() params): Promise<Comment[]>{
    const res: Task = await this.taskService.findByIdWithComments(params.id);
    if (!res)
      throw new TaskNotFoundException(params.id);
    return res.comments;
  }
  @Put('markCompleted')
  async markTaskCompleted(@Param() params){
    const res: Task = await this.taskService.markCompleted(params.id);
    return new TaskInfoDto(res);
  }
  @Put('resetCompleted')
  async resetTaskCompleted(@Param() params): Promise<TaskInfoDto>{
    const res: Task = await this.taskService.resetCompleted(params.id);
    return new TaskInfoDto(res);
  }
  @Put('assignUsers')
  async assignUsersToTask(@Param() params, @Body() assignedUserIds: UserIdArrayDto): Promise<TaskWithAssignedUsersDto>{
    const res: Task = await this.taskService.assignUsers(params.id, assignedUserIds.userIds);
    return new TaskWithAssignedUsersDto(res);
  }
  @Get('assignedUsers')
  async findTaskByIdWithAssignedUsers(@Param() params): Promise<User[]>{
    const res: Task = await this.taskService.findByIdWithAssignedUsers(params.id);
    return res.assignedUsers;
  }
}
