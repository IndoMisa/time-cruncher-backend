import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../user/user.entity';
import {InjectRepository} from '@nestjs/typeorm';
import { EditTaskDto } from './DTOs/edit-task.dto';
import { UserService } from '../user/user.service';
import { TaskNotFoundException } from '../../custom-exceptions/task-not-found.exception';
import { UserIdArrayDto } from '../group/DTOs/user-id-array.dto';
import { pusher } from '../../pusher';
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
  ) {}
  async addTask(newTaskData: Task): Promise<Task>{
    return await this.taskRepository.save(newTaskData);
  }
  async findAll(): Promise<Task[]>{
    return await this.taskRepository.find();
  }
  async findById(id: number): Promise<Task>{
    const res: Task = await this.taskRepository.findOne({ where: {id}});
    if (!res)
      throw new TaskNotFoundException(id);
    return res;
  }
  async findByIdWithCreator(id: number): Promise<Task>{
    const res: Task = await this.taskRepository.findOne({ where: {id}, relations: ['creator']});
    if (!res)
      throw new TaskNotFoundException(id);
    return res;
  }
  async findByIdWithCreatorAndGroup(id: number): Promise<Task>{
    const res: Task = await this.taskRepository.findOne({ where: {id}, relations: ['creator', 'group']});
    if (!res)
      throw new TaskNotFoundException(id);
    return res;
  }
  async findByIdWithGroup(id: number): Promise<Task>{
    const res: Task = await this.taskRepository.findOne({ where: {id}, relations: ['group']});
    if (!res)
      throw new TaskNotFoundException(id);
    return res;
  }
  async findByIdWithComments(id: number): Promise<Task>{
    const res: Task = await this.taskRepository.findOne({ where: {id}, relations: ['comments']});
    if (!res)
      throw new TaskNotFoundException(id);
    return res;
  }
  async findByIdWithAssignedUsers(id: number): Promise<Task>{
    const res: Task = await this.taskRepository.findOne({ where: {id}, relations: ['assignedUsers']});
    if (!res)
      throw new TaskNotFoundException(id);
    return res;
  }
  async removeById(id: number){
    return await this.taskRepository.delete(id);
  }
  async edit(editedTask: Task): Promise<Task> {
    // const task: Task = await this.findById(id);
    // task.group.id = editTaskDto.groupId;
    // task.name = editTaskDto.name;
    // task.description = editTaskDto.description;
    // task.dueTime = editTaskDto.dueTime;
    return await this.taskRepository.save(editedTask);
  }
  async existsWithId(id: number){
    return await this.taskRepository
      .createQueryBuilder()
      .where('id = :id', {id})
      .getCount() === 1;
  }
  async findAllByGroupId(groupId: number){
    return await this.taskRepository.find({where: {group: groupId}});
  }
  async markCompleted(id: number){
    const task: Task = await this.findById(id);
    task.isCompleted = true;
    task.completionTime = (new Date()).toISOString();
    return await this.taskRepository.save(task);
  }
  async resetCompleted(id: number){
    const task: Task = await this.taskRepository.findOne(id);
    task.isCompleted = false;
    task.completionTime = null;
    return await this.taskRepository.save(task);
  }
  async assignUsers(id: number, assignedUserIds: number[]): Promise<Task>{
    const that = this;
    const task = await this.findByIdWithAssignedUsers(id);
    const filteredIds = assignedUserIds.filter( uId => !task.assignedUsers.reduce((acc, el) => acc || uId === el.id, false))
    const users: User[] = await Promise.all(filteredIds.map( async uId => await that.userService.findById(uId)));
    task.assignedUsers = task.assignedUsers.concat(users);
    const res: Task = await this.taskRepository.save(task);
    users.forEach( user => {
      pusher.trigger('private-channel_for_user-' + user.id, 'assigned_to_task', JSON.stringify(res));
    });
    return res;
  }
}
