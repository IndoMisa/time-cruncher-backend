import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';

describe('Group Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [GroupController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: GroupController = module.get<GroupController>(GroupController);
    expect(controller).toBeDefined();
  });
});
