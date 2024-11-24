import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ description: 'Número total de elementos', example: 100 })
  totalItems?: number;

  @ApiProperty({ description: 'Cantidad de elementos por página', example: 10 })
  pageSize?: number;

  @ApiProperty({ description: 'Número total de páginas', example: 10 })
  totalPages?: number;

  @ApiProperty({ description: 'Página actual', example: 1 })
  currentPage?: number;

  @ApiProperty({
    description: 'Cursor para la siguiente página (si aplica)',
    example: 'eyJ0aW1lc3RhbXAiOiIxNzAwODU1NTgwMDAwIn0=',
    required: false,
  })
  nextCursor?: string;
}

export class GenericResponseDto<T> {
  @ApiProperty({ description: 'Estado de la operación', example: 'success' })
  status: 'success' | 'error';

  @ApiProperty({
    description: 'Mensaje descriptivo sobre la operación',
    example: 'Operación completada exitosamente.',
  })
  message: string;

  @ApiProperty({
    description: 'Datos devueltos por el endpoint',
  })
  data: T;

  @ApiProperty({
    description: 'Información de paginación (si aplica)',
    type: PaginationDto,
    required: false,
  })
  pagination?: PaginationDto;
}
