import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() dto: any) {
    return this.patientsService.create(dto);
  }

  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.findOne(id);
  }
  @Get(':patientId/vitals-history')
getVitalsHistory(@Param('patientId', ParseIntPipe) patientId: number) {
  return this.patientsService.getVitalsHistory(patientId);
}

}
