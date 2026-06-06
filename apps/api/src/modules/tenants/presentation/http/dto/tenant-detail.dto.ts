import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TenantStatus } from '@prisma/client';
import { SubscriptionDto } from './subscription.dto';

export class TenantDetailDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ enum: TenantStatus })
  status!: TenantStatus;

  @ApiProperty()
  primaryEmail!: string;

  @ApiPropertyOptional({ nullable: true })
  primaryPhone!: string | null;

  @ApiProperty()
  timezone!: string;

  @ApiProperty()
  currencyCode!: string;

  @ApiPropertyOptional({ type: Object, nullable: true })
  metadata!: Record<string, unknown> | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiPropertyOptional({ nullable: true })
  deletedAt!: Date | null;

  @ApiPropertyOptional({ type: SubscriptionDto, nullable: true })
  activeSubscription!: SubscriptionDto | null;

  @ApiProperty({ type: SubscriptionDto, isArray: true })
  subscriptions!: SubscriptionDto[];
}
