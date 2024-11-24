import { Test, TestingModule } from '@nestjs/testing';
import { StarWarsService } from './star-wars.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';

describe('StarWarsService', () => {
  let service: StarWarsService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarWarsService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<StarWarsService>(StarWarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPeople', () => {
    it('should fetch and return Star Wars characters', async () => {
      const mockResponse = {
        data: {
          results: [{ name: 'Luke Skywalker', height: '172', url: 'url' }],
          count: 1,
        },
      };
      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getPeople(1);
      expect(result).toEqual({
        results: [{ name: 'Luke Skywalker', height: '172', url: 'url' }],
        total: 1,
      });
    });

    it('should handle errors from the Star Wars API', async () => {
      mockHttpService.get.mockReturnValue(
        throwError(() => new Error('API Error')),
      );

      await expect(service.getPeople(1)).rejects.toThrow(
        'An error happened while fetching Star Wars characters!',
      );
    });
  });
});
