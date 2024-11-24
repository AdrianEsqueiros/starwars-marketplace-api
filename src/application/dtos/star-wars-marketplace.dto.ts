import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CharacterDto {
  @ApiProperty({ description: 'Nombre del personaje' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Altura del personaje' })
  @IsString()
  height: string;

  @ApiProperty({ description: 'Género del personaje' })
  @IsString()
  gender: string;

  @ApiProperty({ description: 'URL del personaje' })
  @IsString()
  url: string;
}

export class ProductDto {
  @ApiProperty({ description: 'Título del producto' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Precio del producto' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'URL de la miniatura del producto' })
  @IsString()
  thumbnail: string;

  @ApiProperty({ description: 'Enlace al producto' })
  @IsString()
  permalink: string;

  @ApiProperty({ description: 'Cantidad disponible del producto' })
  @IsNumber()
  available_quantity: number;

  @ApiProperty({ description: 'Moneda del producto' })
  @IsString()
  currency_id: string;
}

export class StarWarsMarketplaceDto {
  @ApiProperty({ description: 'Datos del personaje', type: CharacterDto })
  @ValidateNested()
  @Type(() => CharacterDto)
  character: CharacterDto;

  @ApiProperty({
    description: 'Lista de productos relacionados',
    type: [ProductDto],
  })
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  @IsArray()
  products: ProductDto[];

  @ApiProperty({
    description: 'Estado de la búsqueda',
    enum: ['success', 'no_products_found', 'error'],
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Número de productos encontrados',
  })
  @IsNumber()
  popularityScore: number;

  @ApiProperty({
    description: 'Indicador de si el personaje es tendencia',
  })
  @IsBoolean()
  isTrending: boolean;

  @ApiProperty({
    description: 'Mensaje de error, si aplica',
    required: false,
  })
  @IsOptional()
  @IsString()
  errorMessage?: string;
}
