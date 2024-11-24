import { Test, TestingModule } from '@nestjs/testing';
import { StarWarsMarketplaceController } from './star-wars-marketplace.controller';
import { StarWarsMarketplaceService } from '@/application/services/star-wars-marketplace.service';
import { StarWarsMarketplaceDto } from '@/application/dtos/star-wars-marketplace.dto';

describe('StarWarsMarketplaceController', () => {
  let controller: StarWarsMarketplaceController;
  let service: StarWarsMarketplaceService;

  const mockService = {
    getMarketplaceData: jest.fn(),
    create: jest.fn(),
    getRecords: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StarWarsMarketplaceController],
      providers: [
        {
          provide: StarWarsMarketplaceService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<StarWarsMarketplaceController>(
      StarWarsMarketplaceController,
    );
    service = module.get<StarWarsMarketplaceService>(
      StarWarsMarketplaceService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMarketplaceData', () => {
    it('should call service.getMarketplaceData with correct parameters', async () => {
      const mockResponse = { status: 'success', data: [], message: 'Test' };
      mockService.getMarketplaceData.mockResolvedValue(mockResponse);

      const result = await controller.getMarketplaceData('Peru', 1, 1, 5);
      expect(service.getMarketplaceData).toHaveBeenCalledWith('Peru', 1, 5, 1);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('create', () => {
    it('should call service.create with the provided DTO', async () => {
      const dto: StarWarsMarketplaceDto = {
        character: {
          name: 'Luke Skywalker',
          height: '172',
          gender: 'male',
          url: 'https://swapi.dev/api/people/1/',
        },
        products: [],
        status: 'success',
        popularityScore: 10,
        isTrending: true,
      };

      const mockResponse = { status: 'success', message: 'Object created' };
      mockService.create.mockResolvedValue(mockResponse);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getRecords', () => {
    it('should call service.getRecords with the correct parameters', async () => {
      const mockResponse = {
        status: 'success',
        data: [],
        message: 'Records fetched',
      };
      mockService.getRecords.mockResolvedValue(mockResponse);

      const result = await controller.getRecords(10, 1, 'Character', 'ASC');
      expect(service.getRecords).toHaveBeenCalledWith(
        10,
        1,
        'Character',
        'ASC',
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
