import { Test, TestingModule } from '@nestjs/testing';
import { UserIdController } from './user-id.controller';

describe('UserId Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [UserIdController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: UserIdController = module.get<UserIdController>(UserIdController);
    expect(controller).toBeDefined();
  });
});
