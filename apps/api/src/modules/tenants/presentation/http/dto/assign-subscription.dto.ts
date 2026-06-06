import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, IsObject, IsOptional, IsString, Length, Min } from 'class-validator';

export class AssignSubscriptionDto {
  @ApiProperty({ enum: SubscriptionPlan })
  @IsEnum(SubscriptionPlan)
  plan!: SubscriptionPlan;

  @ApiProperty({ enum: SubscriptionStatus, default: SubscriptionStatus.ACTIVE })
  @IsEnum(SubscriptionStatus)
  status!: SubscriptionStatus;

  @ApiProperty()
  @IsDateString()
  startsAt!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  trialEndsAt?: string;

  @ApiProperty({ minimum: 1, default: 1 })
  @IsInt()
  @Min(1)
  seats!: number;

  @ApiProperty({ minimum: 0, description: 'Price in minor units' })
  @IsInt()
  @Min(0)
  priceMinor!: number;

  @ApiProperty({ example: 'INR', minLength: 3, maxLength: 3 })
  @IsString()
  @Length(3, 3)
  currencyCode!: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
