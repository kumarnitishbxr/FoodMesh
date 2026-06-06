import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsObject, IsOptional, IsPhoneNumber, IsString, Length, Matches, MaxLength } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty()
  @IsString()
  @MaxLength(150)
  name!: string;

  @ApiProperty({ example: 'foodmesh-demo' })
  @IsString()
  @Length(3, 50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens.',
  })
  slug!: string;

  @ApiProperty()
  @IsEmail()
  primaryEmail!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber()
  primaryPhone?: string;

  @ApiProperty({ example: 'Asia/Kolkata' })
  @IsString()
  @MaxLength(100)
  timezone!: string;

  @ApiProperty({ example: 'INR', minLength: 3, maxLength: 3 })
  @IsString()
  @Length(3, 3)
  currencyCode!: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
