import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get, Headers,
  HttpCode, HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put, UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { Group } from './group.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { GroupInfoDto } from './DTOs/group-info.dto';
import { CreateGroupDto } from './DTOs/create-group.dto';
import { EditGroupDto } from './DTOs/edit-group.dto';
import { GroupNotFoundException } from '../../custom-exceptions/group-not-found.exception';
import { pusher } from '../../pusher';
import { create } from 'domain';
import { AuthGuard } from '@nestjs/passport';
@Controller('groups')
@UseGuards(AuthGuard('bearer'))
export class GroupController {
  constructor(private readonly groupService: GroupService, private readonly userService: UserService){}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addGroup(@Headers() header, @Body() body: CreateGroupDto): Promise<GroupInfoDto> {
    const creatorUser: User = await this.userService.findById(body.creatorId);
    const that = this;
    delete body.creatorId;

    const createdGroup: Partial<Group> = body;
    createdGroup.users = [];
    createdGroup.users.push(creatorUser);
    let members: User[] = [];
    if (!body.isPrivate){
      members = await body.memberEmails.reduce(async (prevAcc, email) => {
        const acc = await prevAcc;
        const user = await that.userService.findByEmail(email);
        if (user && user.id !== creatorUser.id){
          delete user.password;
          acc.push(user);
        }
        return acc;
      }, Promise.resolve([]));
      createdGroup.users = createdGroup.users.concat(members);
    }
    delete body.memberEmails;
    const res: Group = await this.groupService.addGroup(createdGroup as Group);
    if (!body.isPrivate){
      members.forEach( member => {
          pusher.trigger('private-channel_for_user-' + member.id, 'added_to_group', JSON.stringify(res));
        },
      );
    }
    return res;
  }
  @Get()
  async findAllGroups(): Promise<GroupInfoDto[]>{
    return await this.groupService.findAll();
  }

  @Get(':id')
  async findGroupById(@Param() params): Promise<GroupInfoDto>{
    const res: Group = await this.groupService.findById(params.id);
    return new GroupInfoDto(res);
  }

  @Delete(':id')
  async removeGroupById(@Param() params) {

    const group = await this.groupService.findByIdWithUsers(params.id);
    if (!group) {
      throw new GroupNotFoundException(params.id);
    }
    const res = await this.groupService.removeById(params.id);
    if (!group.isPrivate) {
      pusher.trigger('private-channel_for_group-' + group.id, 'group_removed', JSON.stringify({ id: group.id }));
    }
    return {
      message: `Group with id = ${params.id} successfully removed.`,
    };
  }

  @Put(':id')
  async editGroup(@Param() params, @Headers() headers, @Body() editGroupDto: EditGroupDto) {
    const userReq: User = await this.userService.findByAccessToken(headers.authorization.split(' ')[1]);
    if (editGroupDto.memberEmails.find( x => x == userReq.email) == undefined)
      editGroupDto.memberEmails.push(userReq.email);
    const members: User[] = await this.userService.findUsersFromEmailList(editGroupDto.memberEmails);
    const res: Group = await this.groupService.edit(params.id, editGroupDto, members);
    if (!res.isPrivate){
      pusher.trigger('private-channel_for_group-' + res.id, 'group_edited', JSON.stringify(res));
    }
    return res;
  }
}
