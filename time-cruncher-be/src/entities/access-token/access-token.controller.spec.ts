import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenController } from './access-token.controller';

describe('AccessToken Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AccessTokenController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: AccessTokenController = module.get<AccessTokenController>(AccessTokenController);
    expect(controller).toBeDefined();
  });
});
