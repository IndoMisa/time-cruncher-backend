import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus, NotFoundException,
  Param,
  Post, Put,
  Response, UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './DTOs/create-user.dto';
import { UserInfoDto } from './DTOs/user-info.dto';
import { SqlException } from '../../custom-exceptions/sql.exception';
import { EditUserDto } from './DTOs/edit-user.dto';
import {AuthGuard} from '@nestjs/passport';
import { UserNotFoundException } from '../../custom-exceptions/user-not-found.exception';
@Controller('users')
@UseGuards(AuthGuard('bearer'))
export class UserController {
  constructor(
    private readonly userService: UserService,
  ){}

  @Get()
  async findAllUsers(): Promise<UserInfoDto[]>{
    const res: UserInfoDto[] = await this.userService.findAll();
    return res;
  }

  @Get(':id')
  async findUserById(@Param() params): Promise<UserInfoDto>{
    const res: User = await this.userService.findById(params.id);
    return new UserInfoDto(res);
  }

  @Delete(':id')
  async removeUserById(@Param() params){
    const res = await this.userService.removeById(params.id);
    return {
      message: `User with id = ${params.id} succesfully removed`,
    };
  }

  @Put(':id')
  async editUser(@Param() params, @Body() editUserDto: EditUserDto): Promise<UserInfoDto>{
    const user = await this.userService.findById(params.id);
    if (!user)
      throw new UserNotFoundException(params.id);
    user.firstname = editUserDto.firstname;
    user.lastname = editUserDto.lastname;
    user.email = editUserDto.email;
    const res = await this.userService.edit(user);
    return new UserInfoDto(res);
  }
}
