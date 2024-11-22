import { Test, TestingModule } from '@nestjs/testing';
import { ClassApplicationController } from './class-application.controller';
import { ClassApplicationService } from './class-application.service';

describe('ClassApplicationController', () => {
  let controller: ClassApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassApplicationController],
      providers: [ClassApplicationService],
    }).compile();

    controller = module.get<ClassApplicationController>(ClassApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
