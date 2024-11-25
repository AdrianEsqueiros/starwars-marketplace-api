import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { StarWarsMarketplaceService } from '@/application/services/star-wars-marketplace.service';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { GenericResponseDto } from '@/shared/dtos/generic-response.dto';
import { StarWarsMarketplaceDto } from '@/application/dtos/star-wars-marketplace.dto';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

@ApiTags('Star Wars Marketplace')
@Controller('')
export class StarWarsMarketplaceController {
  constructor(
    private readonly starWarsMarketplaceService: StarWarsMarketplaceService,
  ) {}

  @Throttle({
    fusionados: { limit: 3, ttl: 60 }, // Máximo 3 intentos  en 60 segundos
    default: { limit: 10, ttl: 60 }, // Máximo 10 peticiones genéricas en 60 segundos
  })
  @Get('fusionados')
  @ApiOperation({
    summary: 'Get merged Star Wars and MercadoLibre data with pagination',
  })
  @ApiQuery({
    name: 'country',
    description: 'Country to search in MercadoLibre (default: Peru)',
    required: false,
    example: 'Peru',
  })
  @ApiQuery({
    name: 'characterPage',
    description: 'Page number for Star Wars characters',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'productPage',
    description: 'Page number for MercadoLibre products per character',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'productLimit',
    description: 'Number of products to fetch per character',
    required: false,
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Merged data retrieved successfully.',
    type: GenericResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid country or missing parameters.',
    schema: {
      example: {
        status: 'error',
        message:
          'The site_id for the country: usa was not found. Try using one of the following countries: Argentina, Bolivia, Brasil, Chile, Colombia, Costa Rica, Ecuador, Guatemala, Honduras, México, Nicaragua, Panamá, Paraguay, Perú, República Dominicana, El Salvador, Uruguay, Venezuela.',
        code: 'SITE_ID_NOT_FOUND',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Unexpected error.',
    schema: {
      example: {
        status: 'error',
        message: 'An unexpected error occurred.',
        code: 'INTERNAL_SERVER_ERROR',
      },
    },
  })
  async getMarketplaceData(
    @Query('country') country: string = 'Peru',
    @Query('characterPage') characterPage: number = 1,
    @Query('productPage') productPage: number = 1,
    @Query('productLimit') productLimit: number = 5,
  ): Promise<GenericResponseDto<StarWarsMarketplaceDto[]>> {
    return await this.starWarsMarketplaceService.getMarketplaceData(
      country,
      characterPage,
      productLimit,
      productPage,
    );
  }

  @Post('almacenar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiOperation({ summary: 'Almacenar un nuevo objeto Star Wars Marketplace' })
  async create(
    @Body() starWarsMarketplaceDto: StarWarsMarketplaceDto,
  ): Promise<{ status: string; message: string }> {
    return this.starWarsMarketplaceService.create(starWarsMarketplaceDto);
  }

  @Get('historial')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiSecurity('access-token')
  @ApiQuery({
    name: 'limit',
    description: 'Limit records per page ',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'pageNumber',
    description: 'Page number',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'sortKey',
    required: false,
    example: 'Character',
  })
  @ApiQuery({
    name: 'sortKey',
    required: false,
    example: 'Character',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    example: 'desc',
  })
  async getRecords(
    @Query('limit') limit: number,
    @Query('pageNumber') pageNumber: number,
    @Query('sortKey') sortKey?: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<any> {
    return this.starWarsMarketplaceService.getRecords(
      limit,
      pageNumber,
      sortKey,
      sortOrder,
    );
  }
}
