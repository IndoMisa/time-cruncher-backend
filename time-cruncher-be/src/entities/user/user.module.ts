import { Module } from '@nestjs/common';
import { User } from './user.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserIdModule } from './user-id/user-id.module';
import { GroupService } from '../group/group.service';
import { Group } from '../group/group.entity';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Group])],
  providers: [UserService, GroupService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
