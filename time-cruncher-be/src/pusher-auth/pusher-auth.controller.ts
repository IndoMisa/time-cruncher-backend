import { Body, Controller, Post, Headers, HttpException, ForbiddenException, HttpStatus, HttpCode, NotFoundException } from '@nestjs/common';
import { pusher } from '../pusher';
import { UserService } from '../entities/user/user.service';
import { GroupService } from '../entities/group/group.service';
import { Group } from '../entities/group/group.entity';
import { User } from '../entities/user/user.entity';
import { AccessTokenService } from '../entities/access-token/access-token.service';

@Controller('pusher')
export class PusherAuthController {
  constructor(
    private readonly userService: UserService,
    private readonly groupService: GroupService,
    private readonly accessTokenService: AccessTokenService,
  ){}
  @Post('auth')
  @HttpCode(HttpStatus.OK)
  async authGroupManagement(@Headers() headers, @Body() body){
    const userId = await this.accessTokenService.findUserId(headers.access_token)
    if (!userId)
      throw new ForbiddenException();
    const channelNameSplit = body.channel_name.split('-', 3);
    const channelName = channelNameSplit[1];
    if (channelName === 'channel_for_user'){
      const channelUserId = channelNameSplit[2];
      if (channelUserId != userId)
        throw new ForbiddenException();
    }
    if (channelName === 'channel_for_group') {
      const groupId = channelNameSplit[2];
      const group: Group = await this.groupService.findByIdWithUsers(groupId);
      const isInGroup: boolean = group.users.filter(user => userId == user.id).length > 0;
      if (!isInGroup)
        throw new ForbiddenException();
    }
    const auth = pusher.authenticate(body.socket_id, body.channel_name);
    return JSON.stringify(auth);
  }
}
