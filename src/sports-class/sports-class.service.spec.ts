import { Test, TestingModule } from '@nestjs/testing';
import { SportsClassService } from './sports-class.service';

describe('SportsClassService', () => {
  let service: SportsClassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SportsClassService],
    }).compile();

    service = module.get<SportsClassService>(SportsClassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
