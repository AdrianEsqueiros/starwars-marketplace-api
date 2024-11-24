import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

export const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamoDBClient);
