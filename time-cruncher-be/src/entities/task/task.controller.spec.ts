import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';

describe('Task Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [TaskController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: TaskController = module.get<TaskController>(TaskController);
    expect(controller).toBeDefined();
  });
});
