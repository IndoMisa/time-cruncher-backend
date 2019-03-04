import { Test, TestingModule } from '@nestjs/testing';
import { GroupIdController } from './group-id.controller';

describe('GroupId Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [GroupIdController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: GroupIdController = module.get<GroupIdController>(GroupIdController);
    expect(controller).toBeDefined();
  });
});
