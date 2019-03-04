import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import { UserController } from './entities/user/user.controller';
import { UserService } from './entities/user/user.service';
import { UserModule } from './entities/user/user.module';
import { GroupController } from './entities/group/group.controller';
import { TaskController } from './entities/task/task.controller';
import { GroupModule } from './entities/group/group.module';
import { TaskModule } from './entities/task/task.module';
import { UserIdController } from './entities/user/user-id/user-id.controller';
import { CommentModule } from './entities/comment/comment.module';
import { GroupService } from './entities/group/group.service';
import { PusherAuthController } from './pusher-auth/pusher-auth.controller';
import { AccessTokenController } from './entities/access-token/access-token.controller';
import { AccessTokenService } from './entities/access-token/access-token.service';
import { AccessToken } from './entities/access-token/access-token.entity';
import { AuthService } from './authentication/auth.service';
import { PassportModule } from '@nestjs/passport';
import { HttpStrategy } from './authentication/http.strategy';
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'bearer'}), TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([AccessToken]), UserModule, GroupModule, TaskModule, CommentModule],
  controllers: [AppController, UserController, GroupController, TaskController, UserIdController, PusherAuthController, AccessTokenController],
  providers: [AppService, AccessTokenService, HttpStrategy, AuthService],
})
export class AppModule {}
