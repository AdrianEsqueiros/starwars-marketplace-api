import { Injectable, Logger } from '@nestjs/common';
import { DynamoDBService } from '../database/dynamodb.service';

@Injectable()
export class StarWarsMarketplaceRepository {
  private readonly logger = new Logger(StarWarsMarketplaceRepository.name);
  private readonly tableName: string;
  private readonly ttlInSeconds = 30 * 60; // 30 minutos
  constructor(private readonly dynamoDBService: DynamoDBService) {
    this.tableName = process.env.DYNAMODB_TABLE!;
  }

  async saveDataCache(cacheKey: string, data: any): Promise<void> {
    const ttl = Math.floor(Date.now() / 1000) + this.ttlInSeconds;
    const item = {
      cacheKey, // Clave única
      data, // Datos a almacenar
      ttl, // Tiempo de expiración
    };
    try {
      await this.dynamoDBService.put(this.tableName, item);
      this.logger.log(`Data saved successfully in table ${this.tableName}`);
    } catch (error) {
      this.logger.error(`Error saving data to DynamoDB: ${error.message}`);
      throw error;
    }
  }
  async getDataCache(cacheKey: string): Promise<any> {
    try {
      const result = await this.dynamoDBService.get(this.tableName, {
        cacheKey,
      });

      // Verificar si los datos están presentes y no han expirado
      if (result.Item && result.Item.ttl > Math.floor(Date.now() / 1000)) {
        return result.Item;
      }

      this.logger.log(`Data for ${cacheKey} has expired or does not exist.`);
      return null; // Datos expirados o inexistentes
    } catch (error) {
      this.logger.error(
        `Error retrieving data from DynamoDB: ${error.message}`,
      );
      throw error;
    }
  }
}
