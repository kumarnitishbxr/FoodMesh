import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchQueryDto {
  @ApiPropertyOptional({ description: 'Free-text search term' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}
