import { Test, TestingModule } from '@nestjs/testing';
import { PusherAuthController } from './pusher-auth.controller';

describe('PusherAuth Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [PusherAuthController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: PusherAuthController = module.get<PusherAuthController>(PusherAuthController);
    expect(controller).toBeDefined();
  });
});
