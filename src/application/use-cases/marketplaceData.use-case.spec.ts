import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceDataUseCase } from './marketplaceData.use-case';
import {
  StarWarsService,
  MercadoLibreService,
} from '@/infrastructure/adapters';
import { StarWarsMarketplaceRepository } from '@/infrastructure/repositories/star-wars-marketplace.repository';
import { RecordRepository } from '@/infrastructure/repositories/record.repository';

describe('MarketplaceDataUseCase', () => {
  let useCase: MarketplaceDataUseCase;

  const mockStarWarsService = {
    getPeople: jest.fn(),
  };
  const mockMercadoLibreService = {
    searchProducts: jest.fn(),
  };
  const mockRepository = {
    saveDataCache: jest.fn(),
    getDataCache: jest.fn(),
  };
  const mockRecordRepository = {
    createData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketplaceDataUseCase,
        { provide: StarWarsService, useValue: mockStarWarsService },
        { provide: MercadoLibreService, useValue: mockMercadoLibreService },
        { provide: StarWarsMarketplaceRepository, useValue: mockRepository },
        { provide: RecordRepository, useValue: mockRecordRepository },
      ],
    }).compile();

    useCase = module.get<MarketplaceDataUseCase>(MarketplaceDataUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return cached data if available', async () => {
      mockRepository.getDataCache.mockResolvedValueOnce({ data: 'cachedData' });
      const result = await useCase.execute('Peru', 1, 5, 1);
      expect(mockRepository.getDataCache).toHaveBeenCalled();
      expect(result).toEqual({ data: 'cachedData' });
    });

    it('should fetch data from services if no cache exists', async () => {
      mockRepository.getDataCache.mockResolvedValueOnce(null);
      mockStarWarsService.getPeople.mockResolvedValueOnce({
        results: [{ name: 'Luke Skywalker' }],
        total: 1,
      });
      mockMercadoLibreService.searchProducts.mockResolvedValueOnce({
        results: [{ title: 'Lightsaber' }],
      });
      mockRepository.saveDataCache.mockResolvedValueOnce(null);

      const result = await useCase.execute('Peru', 1, 5, 1);
      expect(mockStarWarsService.getPeople).toHaveBeenCalledWith(1);
      expect(mockMercadoLibreService.searchProducts).toHaveBeenCalled();
      expect(mockRepository.saveDataCache).toHaveBeenCalled();
      expect(result.status).toBe('success');
    });
  });
});
