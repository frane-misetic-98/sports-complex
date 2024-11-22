import { Test, TestingModule } from '@nestjs/testing';
import { SportsClassController } from './sports-class.controller';
import { SportsClassService } from './sports-class.service';

describe('SportsClassController', () => {
  let controller: SportsClassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SportsClassController],
      providers: [SportsClassService],
    }).compile();

    controller = module.get<SportsClassController>(SportsClassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
