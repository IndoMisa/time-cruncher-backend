import { UserService } from '../entities/user/user.service';
import { Injectable } from '@nestjs/common';
import { AccessTokenService } from '../entities/access-token/access-token.service';

@Injectable()
export class AuthService {
  constructor(private readonly accessTokenService: AccessTokenService){}

  async validateUser(token: string): Promise<any>{
    return await this.accessTokenService.findUserId(token);
  }
}