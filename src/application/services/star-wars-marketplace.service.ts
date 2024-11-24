import { Injectable } from '@nestjs/common';
import { MarketplaceDataUseCase } from '../use-cases/marketplaceData.use-case';
import { GenericResponseDto } from '@/shared/dtos/generic-response.dto';
import { StarWarsMarketplaceDto } from '@/application/dtos/star-wars-marketplace.dto';

@Injectable()
export class StarWarsMarketplaceService {
  constructor(
    private readonly marketplaceDataUseCase: MarketplaceDataUseCase,
  ) {}

  async getMarketplaceData(
    country: string,
    characterPage: number,
    productLimit: number,
    productPage: number,
  ): Promise<GenericResponseDto<StarWarsMarketplaceDto[]>> {
    return this.marketplaceDataUseCase.execute(
      country,
      characterPage,
      productLimit,
      productPage,
    );
  }
  async create(
    data: StarWarsMarketplaceDto,
  ): Promise<{ status: string; message: string }> {
    return await this.marketplaceDataUseCase.create(data);
  }
  async getRecords(
    limit: number = 10,
    pageNumber: number = 1,
    sortKey?: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<GenericResponseDto<any>> {
    return await this.marketplaceDataUseCase.getRecords(
      limit,
      pageNumber,
      sortKey,
      sortOrder,
    );
  }
}
