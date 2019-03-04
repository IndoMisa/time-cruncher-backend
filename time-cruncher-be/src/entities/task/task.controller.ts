import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Headers, UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import DateTimeFormat = Intl.DateTimeFormat;
import { User } from '../user/user.entity';
import { GroupService } from '../group/group.service';
import { UserService } from '../user/user.service';
import { CreateTaskDto } from './DTOs/create-task.dto';
import { Group } from '../group/group.entity';
import { create } from 'domain';
import { TaskInfoDto } from './DTOs/task-info.dto';
import { EditTaskDto } from './DTOs/edit-task.dto';
import { TaskNotFoundException } from '../../custom-exceptions/task-not-found.exception';
import { pusher } from '../../pusher';
import { AuthGuard } from '@nestjs/passport';
import { UserNotFoundException } from '../../custom-exceptions/user-not-found.exception';
import { AccessTokenService } from '../access-token/access-token.service';
@Controller('tasks')
@UseGuards(AuthGuard('bearer'))
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly groupService: GroupService,
    private readonly userService: UserService,
    private readonly accessTokenService: AccessTokenService,
  ) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addTask(@Body() createTaskDto: CreateTaskDto): Promise<TaskInfoDto> {
    const that = this;
    const group: Group = await this.groupService.findByIdWithUsers(createTaskDto.groupId);
    const assignedUsers: User[] = await createTaskDto.assignedUserIds.reduce(async (prevAcc, u) => {
      const acc = await prevAcc;
      if (group.users.filter(user => user.id == u).length > 0)
        acc.push(await that.userService.findById(u));
      return acc;
    }, Promise.resolve([]));
    const creator: User = await this.userService.findById(createTaskDto.creatorId);
    const newTask: Task = new Task();
    newTask.creator = creator;
    newTask.group = group;
    newTask.assignedUsers = assignedUsers;
    newTask.dueTime = createTaskDto.dueTime;
    newTask.name = createTaskDto.name;
    newTask.description = createTaskDto.description;
    newTask.isCompleted = false;
    const res: Task = await this.taskService.addTask(newTask);
    pusher.trigger('private-channel_for_group-' + group.id, 'task_added', JSON.stringify(res));
    const retTask: TaskInfoDto = new TaskInfoDto(res);
    retTask.creatorName = res.creator.firstname + ' ' + res.creator.lastname;
    return retTask;
  }

  @Get()
  async findAllTasks(): Promise<TaskInfoDto[]>{
    const res: Task[] = await this.taskService.findAll();
    return res.map( x => new TaskInfoDto(x));
  }

  @Get(':id')
  async findTaskById(@Param() params): Promise<any>{
    const res: Task = await this.taskService.findByIdWithCreatorAndGroup(params.id);
    if (!res)
      throw new TaskNotFoundException(params.id);
    const retTask: TaskInfoDto = new TaskInfoDto(res);
    retTask.creatorName = res.creator.firstname + ' ' + res.creator.lastname;
    return {...retTask, groupId: res.group.id};
  }
  @Delete(':id')
  async removeTaskById(@Param() params, @Headers() headers){
    const destructorId = await this.accessTokenService.findUserId(headers.authorization.split(' ')[1]);
    const task = await this.taskService.findByIdWithGroup(params.id);
    if (!task)
      throw new TaskNotFoundException(params.id);
    const res = await this.taskService.removeById(params.id);
    pusher.trigger('private-channel_for_group-' + task.group.id, 'task_removed', JSON.stringify({id: params.id, destructorId, groupId: task.group.id}));
    return {messsage: `Task with id = ${params.id} successfully removed.`};
  }

  @Put(':id')
  async editTask(@Param() params, @Headers() headers, @Body() editTaskDto: EditTaskDto): Promise<Task> {
    const taskForEdit: Task = await this.taskService.findByIdWithGroup(params.id);
    taskForEdit.name = editTaskDto.name;
    taskForEdit.description = editTaskDto.description;
    taskForEdit.dueTime = editTaskDto.dueTime;
    // const retTask: Task = await this.taskService.edit(params.id, editTaskDto);
    taskForEdit.assignedUsers = await this.userService.findUsersFromIdList(editTaskDto.assignedUserIds);
    if (!editTaskDto.isCompleted){
      taskForEdit.isCompleted = false;
      taskForEdit.completionTime = null;
      taskForEdit.executor = null;
    } else if (!taskForEdit.isCompleted) {
      taskForEdit.isCompleted = true;
      taskForEdit.completionTime = (new Date()).toISOString();
      taskForEdit.executor = await this.userService.findByAccessToken(headers.authorization.split(' ')[1]);
      delete taskForEdit.executor.password;
    }
    const res = await this.taskService.edit(taskForEdit);
    const modifierId = await this.accessTokenService.findUserId(headers.authorization.split(' ')[1])
    if (res){
      pusher.trigger('private-channel_for_group-' + taskForEdit.group.id, 'task_edited', JSON.stringify({...taskForEdit, modifierId}));
    }
    return res;
  }
}
