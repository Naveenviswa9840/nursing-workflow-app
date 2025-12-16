import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { InvestigationsService } from './investigations.service';

@Controller('patients/:patientId/investigations')
export class InvestigationsController {
  constructor(private readonly service: InvestigationsService) {}

  @Post()
  create(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Body() body: any,
  ) {
    return this.service.create(patientId, body);
  }

  @Get()
  findAll(
    @Param('patientId', ParseIntPipe) patientId: number,
  ) {
    return this.service.findByPatient(patientId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'PENDING' | 'COMPLETED',
  ) {
    return this.service.updateStatus(id, status);
  }
}
