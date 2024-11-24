import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { IPeople, IPeopleGet, IPeopleResponse } from '@/domain/interfaces';
import { mapToInterface } from '@/shared/utils/mapper.util';

@Injectable()
export class StarWarsService {
  private readonly logger = new Logger(StarWarsService.name);
  private readonly BASE_URL = 'https://swapi.dev/api';

  constructor(private readonly httpService: HttpService) {}

  async getPeople(page: number = 1): Promise<IPeopleResponse> {
    this.logger.log(`Fetching page ${page} of people from Star Wars API...`);

    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<IPeopleGet>(`${this.BASE_URL}/people/?page=${page}`)
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(
                `Error fetching data from SWAPI: ${error.message}`,
                error.stack,
              );
              throw new Error(
                'An error happened while fetching Star Wars characters!',
              );
            }),
          ),
      );

      const keys = [
        'name',
        'height',
        'mass',
        'hair_color',
        'skin_color',
        'eye_color',
        'birth_year',
        'gender',
        'homeworld',
        'vehicles',
        'starships',
        'url',
      ] as (keyof IPeople)[];

      const simplifiedPeople = mapToInterface<IPeople>(data.results, keys);

      this.logger.log(
        `Successfully fetched and simplified ${simplifiedPeople.length} characters from page ${page} of Star Wars API.`,
      );

      return { results: simplifiedPeople, total: data.count };
    } catch (error) {
      this.logger.error('Unhandled error occurred', error.stack);
      throw error;
    }
  }
}
