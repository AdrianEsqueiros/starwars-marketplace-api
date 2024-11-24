import { Test, TestingModule } from '@nestjs/testing';
import { StarWarsMarketplaceRepository } from './star-wars-marketplace.repository';
import { DynamoDBService } from '../database/dynamodb.service';

describe('StarWarsMarketplaceRepository', () => {
  let repository: StarWarsMarketplaceRepository;
  const mockDynamoDBService = {
    put: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarWarsMarketplaceRepository,
        { provide: DynamoDBService, useValue: mockDynamoDBService },
      ],
    }).compile();

    repository = module.get<StarWarsMarketplaceRepository>(
      StarWarsMarketplaceRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('saveDataCache', () => {
    it('should call DynamoDBService.put with correct parameters', async () => {
      const cacheKey = 'cacheKey';
      const data = { data: 'test' };
      const ttl = Math.floor(Date.now() / 1000) + repository['ttlInSeconds']; // Calcula el TTL esperado

      await repository.saveDataCache(cacheKey, data);

      expect(mockDynamoDBService.put).toHaveBeenCalledWith(
        repository['tableName'], // Verifica que se use el nombre de la tabla
        {
          cacheKey,
          data,
          ttl,
        },
      );
    });
  });

  describe('getDataCache', () => {
    it('should return cached data if not expired', async () => {
      mockDynamoDBService.get.mockResolvedValueOnce({
        Item: { data: 'cachedData', ttl: Math.floor(Date.now() / 1000) + 100 },
      });
      const result = await repository.getDataCache('cacheKey');
      expect(result).toEqual({ data: 'cachedData', ttl: expect.any(Number) });
    });

    it('should return null if cache is expired', async () => {
      mockDynamoDBService.get.mockResolvedValueOnce({
        Item: { ttl: Math.floor(Date.now() / 1000) - 100 },
      });
      const result = await repository.getDataCache('cacheKey');
      expect(result).toBeNull();
    });
  });
});
