import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  StarWarsService,
  MercadoLibreService,
} from '@/infrastructure/adapters';

import {
  IStarWarsMarketplace,
  Status,
} from '@/domain/models/star-wars-marketplace.entity';
import {
  GenericResponseDto,
  PaginationDto,
} from '@/shared/dtos/generic-response.dto';
import { StarWarsMarketplaceDto } from '../dtos/star-wars-marketplace.dto';
import { v4 as uuidv4 } from 'uuid';
import { StarWarsMarketplaceRepository } from '@/infrastructure/repositories/star-wars-marketplace.repository';
import { RecordRepository } from '../../infrastructure/repositories/record.repository';

@Injectable()
export class MarketplaceDataUseCase {
  private readonly logger = new Logger(MarketplaceDataUseCase.name);

  constructor(
    private readonly starWarsService: StarWarsService,
    private readonly mercadoLibreService: MercadoLibreService,
    private readonly starwarsMarketplaceRepository: StarWarsMarketplaceRepository,
    private readonly recordRepository: RecordRepository,
  ) {}

  async execute(
    country: string,
    characterPage: number,
    productLimit: number,
    productPage: number,
  ): Promise<GenericResponseDto<IStarWarsMarketplace[]>> {
    const cacheKey = `${country}_${characterPage}_${productPage}_${productLimit}`;
    const cachedData =
      await this.starwarsMarketplaceRepository.getDataCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const starWarsData = await this.starWarsService.getPeople(characterPage);
    const characters = starWarsData.results;

    const marketplaceData = await Promise.all(
      characters.map(async (character) => {
        const productOffset = (productPage - 1) * productLimit;
        const productData = await this.mercadoLibreService.searchProducts(
          character.name,
          country,
          productLimit,
          productOffset,
        );
        const data = {
          character: {
            name: character.name,
            height: character.height,
            gender: character.gender,
            url: character.url,
          },
          products: productData.results,
          status:
            productData.results.length > 0
              ? 'success'
              : ('no_products_found' as Status),
          popularityScore: productData.results.length,
          isTrending: productData.results.some(
            (product) => product.available_quantity > 50,
          ),
        };
        this.recordRepository.createData(data.character.name, data);
        return data;
      }),
    );

    await this.starwarsMarketplaceRepository.saveDataCache(
      cacheKey,
      marketplaceData,
    );

    const pagination: PaginationDto = {
      totalItems: starWarsData.total,
      pageSize: characters.length,
      totalPages: Math.ceil(starWarsData.total / characters.length),
      currentPage: characterPage,
    };

    return {
      status: 'success',
      message: 'Datos fusionados obtenidos correctamente.',
      data: marketplaceData,
      pagination,
    };
  }

  async create(
    data: StarWarsMarketplaceDto,
  ): Promise<{ status: string; message: string }> {
    const item = {
      PK: `MARKETPLACE#${uuidv4()}`,
      ...data,
    };

    try {
      await this.recordRepository.createData(item.PK, item);
      this.logger.log('Objeto almacenado correctamente.');
      return { status: 'success', message: 'Objeto almacenado correctamente.' };
    } catch (error) {
      this.logger.error(
        `Error al almacenar el objeto: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getRecords(
    limit: number,
    pageNumber: number,
    sortKey?: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<GenericResponseDto<any>> {
    try {
      if (limit <= 0) {
        throw new BadRequestException('limit must be a positive number');
      }
      if (pageNumber < 1) {
        throw new BadRequestException('pageNumber must be 1 or greater');
      }

      const { totalItems, totalPages, data } =
        await this.recordRepository.getRecordData(
          limit,
          pageNumber,
          sortKey,
          sortOrder,
        );

      const pagination: PaginationDto = {
        totalItems,
        pageSize: limit,
        totalPages,
        currentPage: pageNumber,
      };

      return {
        status: 'success',
        message: 'Datos fusionados obtenidos correctamente.',
        data,
        pagination,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
