import { Controller, Post, Get, Param, Body, ParseIntPipe } from '@nestjs/common';
import { VitalsService } from './vitals.service';
import { CreateVitalsDto } from './dto/create-vitals.dto';

@Controller('patients/:patientId/vitals')
export class VitalsController {
  constructor(private readonly vitalsService: VitalsService) {}

  // ➕ Add vitals
  @Post()
  create(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Body() dto: CreateVitalsDto,
  ) {
    return this.vitalsService.create(patientId, dto);
  }

  // 📜 Get vitals history
  @Get()
  findByPatient(
    @Param('patientId', ParseIntPipe) patientId: number,
  ) {
    return this.vitalsService.findByPatient(patientId);
  }
}
