import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

export class SubscriptionDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  tenantId!: string;

  @ApiProperty({ enum: SubscriptionPlan })
  plan!: SubscriptionPlan;

  @ApiProperty({ enum: SubscriptionStatus })
  status!: SubscriptionStatus;

  @ApiProperty()
  startsAt!: Date;

  @ApiPropertyOptional({ nullable: true })
  endsAt!: Date | null;

  @ApiPropertyOptional({ nullable: true })
  trialEndsAt!: Date | null;

  @ApiProperty()
  seats!: number;

  @ApiProperty()
  priceMinor!: number;

  @ApiProperty()
  currencyCode!: string;

  @ApiPropertyOptional({ type: Object, nullable: true })
  metadata!: Record<string, unknown> | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
