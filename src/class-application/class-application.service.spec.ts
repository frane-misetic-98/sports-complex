import { Test, TestingModule } from '@nestjs/testing';
import { ClassApplicationService } from './class-application.service';

describe('ClassApplicationService', () => {
  let service: ClassApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassApplicationService],
    }).compile();

    service = module.get<ClassApplicationService>(ClassApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
