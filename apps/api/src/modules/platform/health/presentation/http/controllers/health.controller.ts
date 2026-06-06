import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../../../identity/presentation/http/decorators/public.decorator';
import { HealthService } from '../../../health/application/health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Check API and database health' })
  @ApiOkResponse({ description: 'Health check response' })
  check() {
    return this.healthService.check();
  }
}
