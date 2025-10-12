import { Test, TestingModule } from '@nestjs/testing';
import { BarGateway } from './bar.gateway';

describe('BarGateway', () => {
  let gateway: BarGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BarGateway],
    }).compile();

    gateway = module.get<BarGateway>(BarGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
