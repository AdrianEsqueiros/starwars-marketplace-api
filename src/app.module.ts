import {
  ExecutionContext,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { StarWarsMarketplaceService } from './application/services/star-wars-marketplace.service';
import {
  MercadoLibreService,
  StarWarsService,
} from './infrastructure/adapters';
import { HttpModule } from '@nestjs/axios';
import { StarWarsMarketplaceController } from './presentation/controllers/star-wars-marketplace.controller';
import { DynamoDBService } from './infrastructure/database/dynamodb.service';
import { MarketplaceDataUseCase } from './application/use-cases/marketplaceData.use-case';
import { RequestLoggerMiddleware } from './presentation/middlewares/request-logger.middleware';
import { ThrottlerModule } from '@nestjs/throttler';
import { StarWarsMarketplaceRepository } from './infrastructure/repositories/star-wars-marketplace.repository';
import { RecordRepository } from './infrastructure/repositories/record.repository';

@Module({
  imports: [
    HttpModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60, // Ventana de tiempo en segundos
          limit: 10, // Límite de 10 peticiones por ventana
        },
        {
          ttl: 30,
          limit: 5, // Configuración adicional
        },
      ],
      skipIf: (context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.headers['x-api-key'] === 'my-secret-key'; // Saltar si la clave API es válida
      },
      ignoreUserAgents: [/Googlebot/i, /Bingbot/i], // Ignorar bots específicos
      getTracker: (context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.headers['x-client-id'] || request.ip; // Identificar clientes por un header personalizado o IP
      },
      generateKey: (context: ExecutionContext, tracker: string) => {
        const request = context.switchToHttp().getRequest();
        return `${request.method}-${tracker}`; // Generar clave única basada en el método HTTP y el tracker
      },
      errorMessage: 'Too many requests, please try again later.', // Mensaje personalizado
    }),
  ],
  controllers: [StarWarsMarketplaceController],
  providers: [
    StarWarsService,
    MercadoLibreService,
    StarWarsMarketplaceService,
    DynamoDBService,
    MarketplaceDataUseCase,
    StarWarsMarketplaceRepository,
    RecordRepository,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
