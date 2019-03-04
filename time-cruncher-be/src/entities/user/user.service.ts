import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { getConnection, getRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import {InjectRepository} from '@nestjs/typeorm';
import { SqlException } from '../../custom-exceptions/sql.exception';
import { CreateUserDto } from './DTOs/create-user.dto';
import { UserInfoDto } from './DTOs/user-info.dto';
import { validate } from 'class-validator';
import { classToClass, classToPlain, plainToClass } from 'class-transformer';
import { GroupService } from '../group/group.service';
import { EditUserDto } from './DTOs/edit-user.dto';
import { Task } from '../task/task.entity';
import { UserNotFoundException } from '../../custom-exceptions/user-not-found.exception';
import { async } from 'rxjs/internal/scheduler/async';
import {AccessToken} from '../access-token/access-token.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly groupService: GroupService,
  ){}
  async addUser(newUser: User): Promise<User>{
    const res: User = await this.userRepository.save(newUser);
    return res;
  }
  async findAll(): Promise<UserInfoDto[]> {
    const res: User[] = await this.userRepository.find();
    return res.map( x => new UserInfoDto(x));
  }
  async findById(id: number): Promise<User> {
    const res: User = await this.userRepository.findOne({ where: { id } });
    if (!res)
      throw new UserNotFoundException(id);
    delete res.password;
    return res;
  }
  async findByAccessToken(accessToken: string): Promise<User>{
    const res: AccessToken = await getRepository(AccessToken).findOne({ where: { token: accessToken }, relations: ['user']});
    if (!res)
      throw new NotFoundException();
    return res.user;
  }
  async findByEmail(email: string): Promise<User> {
    const res: User = await this.userRepository.findOne({ where: { email } });
    if (!res)
      throw new HttpException({message: "User with email: '" + email + "' not found."}, 404);
    return res;
  }
  async findUsersFromEmailList(emailList: string[]){
    const users: User[] = await Promise.all(emailList.map(async email => {
      return await this.findByEmail(email);
    }))
    return users;
  }
  async findUsersFromIdList(idList: number[]){
    const users: User[] = await Promise.all(idList.map(async id => {
      return await this.findById(id);
    }))
    return users;
  }
  async findByEmailWithAccessToken(email: string): Promise<User> {
    const res: User = await this.userRepository.findOne({ where: { email }, relations: ['accessToken'] });
    if (!res)
      throw new NotFoundException();
    return res;
  }
  async findByIdWithGroups(id: number): Promise<User> {
    const res: User = await this.userRepository.findOne({ where: { id }, relations: ['groups'] });
    if (!res)
      throw new UserNotFoundException(id);
    return res;
  }
  async findByIdWithAssignedTasks(id: number): Promise<User> {
    const res: User = await this.userRepository.findOne({ where: { id }, relations: ['assignedTasks'] });
    if (!res)
      throw new UserNotFoundException(id);
    return res;
  }
  async findByIdWithCreatedTasks(id: number): Promise<User> {
    const res: User = await this.userRepository.findOne({ where: { id }, relations: ['createdTasks'] });
    if (!res)
      throw new UserNotFoundException(id);
    return res;
  }
  async findDailyTasksByUserId(id: number, dateString: string): Promise<Task[]> {
    const dateLow = new Date(new Date(dateString).setHours(0, 0, 0, 0));
    const dateHigh = new Date(new Date(dateString).setHours(23, 59, 59, 0));
    const res: User = await this.userRepository.createQueryBuilder('user')
      .innerJoinAndSelect('user.assignedTasks', 'task', 'task.dueTime >= :dateLow and task.dueTime <= :dateHigh', { dateLow, dateHigh })
      .where('user.id = :id', { id })
      .getOne();
    if (!res) return [];
    return res.assignedTasks;
  }
  async findWeeklyTasksByUserId(id: number, dateString: string): Promise<any>{
    const daysArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const currentDate = new Date(dateString);
    if (isNaN(currentDate.getDate())){
      throw new BadRequestException();
    }
    let targetDayStart: Date = new Date();
    let targetDayEnd: Date = new Date();
    if (currentDate.getDay() === 0){
      targetDayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6, 0, 0, 0);
      targetDayEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6, 23, 59, 59);
    }
    else {
      targetDayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 1, 0, 0, 0);
      targetDayEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 1, 23, 59, 59);
    }
    const retArray = [];
    for  (let i = 0; i < 7; i++){
      const res: User = await this.userRepository.createQueryBuilder('user')
        .innerJoinAndSelect('user.assignedTasks', 'task', 'task.dueTime >= :targetDayStart and task.dueTime <= :targetDayEnd', { targetDayStart, targetDayEnd })
        .where('user.id = :id', { id })
        .getOne();
      let foundTasks = [];
      if (res !== undefined)
        foundTasks = res.assignedTasks;
      retArray.push({
        name: daysArray[i],
        tasks: foundTasks,
      })
      targetDayStart.setDate(targetDayStart.getDate() + 1);
      targetDayEnd.setDate(targetDayEnd.getDate() + 1);
    }
    return retArray;
  }
  async findMonthlyTasksByUserId(id: number, dateString: string): Promise<Task[]> {
    const targetDate = new Date(dateString);
    const dateLow = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1, 0, 0, 0);
    const dateHigh = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59);
    const res: User = await this.userRepository.createQueryBuilder('user')
      .innerJoinAndSelect('user.assignedTasks', 'task', 'task.dueTime >= :dateLow and task.dueTime <= :dateHigh', { dateLow, dateHigh })
      .where('user.id = :id', { id })
      .getOne();
    if (!res) return [];
    return res.assignedTasks;
  }
  async removeById(id: number) {
    const res = (await this.findByIdWithGroups(id)).groups;
    const that = this;
    const groupIdList = [];
    await Promise.all(res.map( async group => {
      const userCount = await getRepository(User)
        .createQueryBuilder('user')
        .innerJoin('user.groups', 'group', 'group.id = :id', { id: group.id })
        .getCount();
      if (userCount === 1)
        groupIdList.push(group.id);
      return {};
    }));
    await groupIdList.forEach( x => this.groupService.removeById(x));
    return await this.userRepository.delete(id);
  }
  async edit(user: User): Promise<User> {
    try {
      return await this.userRepository.save(user);
    } catch (exception) {
      throw new SqlException(exception.message);
    }
  }
  async existsWithId(id: number) {
    return (await this.userRepository.findOne(id) !== undefined);
  }
  async authUser(userId: number, userPassword: string): Promise<boolean>{
    const user: User = await this.userRepository.findOne(userId);
    if (!user)
      return false;
    if (user.password !== userPassword)
      return false;
    return true;
  }
  async findUncategorizedTasks(userId: number): Promise<Task[]>{
    const res = await this.userRepository.findOne({ where: { id: userId }, relations: ['assignedTasks'] });
    if (!res)
      throw new UserNotFoundException(userId);
    return res.assignedTasks.filter( x => !x.dueTime );
  }
}
