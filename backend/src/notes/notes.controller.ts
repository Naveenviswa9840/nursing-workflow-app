import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('patients/:patientId/notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(
    @Param('patientId', ParseIntPipe) patientId: number, // ✅ FIX
    @Body() body: { content: string },
    @Req() req,
  ) {
    return this.notesService.create(patientId, body, req.user);
  }

  @Get()
  findAll(
    @Param('patientId', ParseIntPipe) patientId: number, // ✅ FIX
  ) {
    return this.notesService.findByPatient(patientId);
  }
}
