import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/DTOs/create-user.dto';
import { UserInfoDto } from '../user/DTOs/user-info.dto';
import { User } from '../user/user.entity';
import { SqlException } from '../../custom-exceptions/sql.exception';
import { AccessTokenService } from './access-token.service';
import { AccessToken } from './access-token.entity';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import { Group } from '../group/group.entity';
import { CreateGroupDto } from '../group/DTOs/create-group.dto';
import { GroupService } from '../group/group.service';
import { LoginDto } from './DTOs/login.dto';
import { MyBcrypt } from '../../additional/passEncription.bcrypt';
import { create } from 'domain';

@Controller()
export class AccessTokenController {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly userService: UserService,
    private readonly groupService: GroupService,
  ){}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async addUser(@Body() createUserDto: CreateUserDto){
    try {
      createUserDto.password = await MyBcrypt.encryptPassword(createUserDto.password, 10);
      const user: User = await this.userService.addUser(createUserDto as User);
      const res: AccessToken = await this.accessTokenService.createToken(user);
      const newGeneralGroup: Partial<Group> = {
        name: 'General',
        description: 'General group for general things. (duh)',
        isPrivate: true,
        users: [user],
      }
      const createdGeneralGroup: Group = await this.groupService.addGroup(newGeneralGroup as Group);
      delete createdGeneralGroup.users;
      res.user.groups = [createdGeneralGroup];
      delete res.user.password;
      return res;
    }
    catch (exception){
      throw new SqlException(exception.message);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  // async getAccessToken(@Body() loginData: LoginDto){
  //   const user: User = await this.userService.findByEmailWithAccessToken(loginData.email);
  //   if (!(await MyBcrypt.comparePassword(loginData.password, user.password))){
  //     throw new HttpException({ message: 'Invalid email or password' }, 404);
  //   }
  //   delete user.password;
  //   return user;
  // }
  async getAccessTokenTemp(@Body() loginData: LoginDto){
    const user: User = await this.userService.findByEmailWithAccessToken(loginData.email);
    if (loginData.password != user.password){
      throw new HttpException({ message: 'Invalid email or password' }, 404);
    }
    delete user.password;
    return user;
  }
}
