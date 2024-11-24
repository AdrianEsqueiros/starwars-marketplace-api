import { Injectable, Logger } from '@nestjs/common';
import { DynamoDBService } from '../database/dynamodb.service';
import { normalizeData } from '@/shared/utils/normalizeData.util';

@Injectable()
export class RecordRepository {
  private readonly logger = new Logger(RecordRepository.name);
  private readonly tableName: string;
  constructor(private readonly dynamoDBService: DynamoDBService) {
    this.tableName = process.env.HISTORY_TABLE!;
  }

  async getRecordData(
    limit: number,
    pageNumber: number,
    sortKey?: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ totalItems: number; totalPages: number; data: any[] }> {
    try {
      const result = await this.dynamoDBService.scan(this.tableName);

      // Transformar los datos al formato limpio
      const items = (result || []).map((item: any) => normalizeData(item));
      console.log(items, 'items');

      // Ordenar resultados si se proporciona sortKey
      if (sortKey) {
        items.sort((a, b) => {
          const aValue = a[sortKey];
          const bValue = b[sortKey];

          if (sortOrder === 'ASC') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }

      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (pageNumber - 1) * limit;
      const endIndex = startIndex + limit;

      const data = items.slice(startIndex, endIndex);

      return { totalItems, totalPages, data };
    } catch (error) {
      this.logger.error(
        `Error retrieving history data from DynamoDB: ${error.message}`,
      );
      throw error;
    }
  }

  async createData(partitionKey: string, data: any): Promise<void> {
    const item = {
      PK: partitionKey,
      timestamp: Date.now(),
      ...data,
    };
    try {
      await this.dynamoDBService.put(this.tableName, item);
      this.logger.log(`Data saved successfully in table ${this.tableName}`);
    } catch (error) {
      this.logger.error(`Error saving data to DynamoDB: ${error.message}`);
      throw error;
    }
  }
}
