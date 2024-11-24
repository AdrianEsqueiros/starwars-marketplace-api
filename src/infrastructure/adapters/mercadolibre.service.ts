import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { IProduct, IProductGet, IProductResponse } from '@/domain/interfaces';

import { CustomHttpException } from '@/shared/exceptions/custom-http.exception';
import { getSiteIdByCountry } from '@/shared/utils/getSiteByCountry';
import { MERCADO_LIBRE_SITES } from '@/shared/constants/mercado-libre-sites';
import { mapToInterface } from '@/shared/utils/mapper.util';

@Injectable()
export class MercadoLibreService {
  private readonly logger = new Logger(MercadoLibreService.name);

  constructor(private readonly httpService: HttpService) {}

  async searchProducts(
    query: string,
    country: string,
    limit: number,
    offset: number,
  ): Promise<IProductResponse> {
    const site = getSiteIdByCountry(country);

    if (!site) {
      const availableCountries = MERCADO_LIBRE_SITES.map(
        (site) => site.country,
      ).join(', ');
      const errorMessage = `The site_id for the country: ${country} was not found. Try using one of the following countries: ${availableCountries}.`;
      this.logger.error(errorMessage);
      throw new CustomHttpException(
        errorMessage,
        'SITE_ID_NOT_FOUND',
        HttpStatus.BAD_REQUEST,
      );
    }

    const baseUrl = `https://api.mercadolibre.com/sites/${site.site_id}/search`;
    this.logger.log(
      `Fetching products in MercadoLibre (${site.country}, site_id: ${site.site_id}) for: ${query}`,
    );

    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<IProductGet>(
            `${baseUrl}?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`,
          )
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(
                `Error fetching data from MercadoLibre API for ${site.site_id}: ${error.message}`,
                error.stack,
              );
              throw new Error(
                `An error happened while fetching products in MercadoLibre (${site.country})!`,
              );
            }),
          ),
      );

      const simplifiedProduct = mapToInterface(data.results, [
        'id',
        'title',
        'price',
        'thumbnail',
        'permalink',
        'available_quantity',
        'currency_id',
      ] as (keyof IProduct)[]);

      return { results: simplifiedProduct, total: data.paging.total };
    } catch (error) {
      this.logger.error(
        `Unhandled error while fetching products from MercadoLibre (${site.site_id})`,
        error.stack,
      );
      throw error;
    }
  }
}
