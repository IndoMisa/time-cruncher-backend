import { Test, TestingModule } from '@nestjs/testing';
import { TaskIdController } from './task-id.controller';

describe('TaskId Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [TaskIdController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: TaskIdController = module.get<TaskIdController>(TaskIdController);
    expect(controller).toBeDefined();
  });
});
