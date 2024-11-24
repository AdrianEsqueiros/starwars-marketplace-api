import { Test, TestingModule } from '@nestjs/testing';
import { StarWarsMarketplaceService } from './star-wars-marketplace.service';
import { MarketplaceDataUseCase } from '../use-cases/marketplaceData.use-case';

describe('StarWarsMarketplaceService', () => {
  let service: StarWarsMarketplaceService;
  let useCase: MarketplaceDataUseCase;

  const mockUseCase = {
    execute: jest.fn(),
    create: jest.fn(),
    getRecords: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarWarsMarketplaceService,
        {
          provide: MarketplaceDataUseCase,
          useValue: mockUseCase,
        },
      ],
    }).compile();

    service = module.get<StarWarsMarketplaceService>(
      StarWarsMarketplaceService,
    );
    useCase = module.get<MarketplaceDataUseCase>(MarketplaceDataUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMarketplaceData', () => {
    it('should call useCase.execute with correct parameters', async () => {
      mockUseCase.execute.mockResolvedValueOnce({
        status: 'success',
        data: [],
      });
      const result = await service.getMarketplaceData('Peru', 1, 5, 1);
      expect(useCase.execute).toHaveBeenCalledWith('Peru', 1, 5, 1);
      expect(result).toEqual({ status: 'success', data: [] });
    });
  });

  describe('create', () => {
    it('should call useCase.create with correct data', async () => {
      mockUseCase.create.mockResolvedValueOnce({
        status: 'success',
        message: 'Created',
      });
      const result = await service.create({} as any);
      expect(useCase.create).toHaveBeenCalledWith({});
      expect(result).toEqual({ status: 'success', message: 'Created' });
    });
  });

  describe('getRecords', () => {
    it('should call useCase.getRecords with correct parameters', async () => {
      mockUseCase.getRecords.mockResolvedValueOnce({
        status: 'success',
        data: [],
      });
      const result = await service.getRecords(10, 1, 'name', 'ASC');
      expect(useCase.getRecords).toHaveBeenCalledWith(10, 1, 'name', 'ASC');
      expect(result).toEqual({ status: 'success', data: [] });
    });
  });
});
