import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AccessToken } from './access-token.entity';
import {InjectRepository} from '@nestjs/typeorm';
import { User } from '../user/user.entity';
@Injectable()
export class AccessTokenService {
  constructor(
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>,
  ){}
  async createToken(user: User): Promise<AccessToken>{
    const accessToken: Partial<AccessToken> = {};
    accessToken.user = user;
    accessToken.token = new Date().getTime().toString();
    const res: AccessToken = await this.accessTokenRepository.save(accessToken as AccessToken);
    return res;
  }
  async findToken(userId: number): Promise<AccessToken>{
    const res: AccessToken = await this.accessTokenRepository.findOne(userId);
    if (!res)
      throw new NotFoundException();
    return res;
  }
  async findUserId(accessToken: string): Promise<number>{
    const res: AccessToken = await this.accessTokenRepository.findOne(accessToken, {relations: ['user']})
    if (res)
      return res.user.id;
    return 0;
  }
}
