import { Injectable, Logger } from '@nestjs/common';
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDBDocClient } from './dynamodb.config';
import { ScanCommand } from '@aws-sdk/client-dynamodb';

@Injectable()
export class DynamoDBService {
  private readonly logger = new Logger(DynamoDBService.name);
  constructor() {}
  async put(tableName: string, item: Record<string, any>): Promise<any> {
    try {
      const command = new PutCommand({
        TableName: tableName,
        Item: { ...item },
      });
      await dynamoDBDocClient.send(command);
      this.logger.log(`Data saved successfully in table ${tableName}`);
      return item;
    } catch (error) {
      this.logger.error(`Error saving data to DynamoDB: ${error.message}`);
      throw error;
    }
  }
  async get(tableName: string, id: Record<string, any>): Promise<any> {
    try {
      const command = new GetCommand({ TableName: tableName, Key: id });
      const result = await dynamoDBDocClient.send(command);
      return result;
    } catch (error) {
      this.logger.error(
        `Error retrieving data from DynamoDB: ${error.message}`,
      );
      throw error;
    }
  }
  async scan(tableName: string): Promise<any[]> {
    try {
      const command = new ScanCommand({ TableName: tableName });
      const result = await dynamoDBDocClient.send(command);
      return result.Items;
    } catch (error) {
      this.logger.error(
        `Error retrieving data from DynamoDB: ${error.message}`,
      );
      throw error;
    }
  }
}
