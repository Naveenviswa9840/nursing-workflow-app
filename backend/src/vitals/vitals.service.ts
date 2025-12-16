import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVitalsDto } from './dto/create-vitals.dto';

@Injectable()
export class VitalsService {
  constructor(private prisma: PrismaService) {}

  async create(patientId: number, dto: CreateVitalsDto) {
    const isCritical = !!(
      (dto.bloodPressureSys !== undefined &&
        (dto.bloodPressureSys < 90 || dto.bloodPressureSys > 180)) ||

      (dto.bloodPressureDia !== undefined &&
        (dto.bloodPressureDia < 60 || dto.bloodPressureDia > 120)) ||

      (dto.temperature !== undefined &&
        (dto.temperature < 35 || dto.temperature > 38)) ||

      (dto.spo2 !== undefined && dto.spo2 < 92) ||

      (dto.pulseRate !== undefined &&
        (dto.pulseRate < 50 || dto.pulseRate > 120)) ||

      (dto.respiratoryRate !== undefined &&
        (dto.respiratoryRate < 12 || dto.respiratoryRate > 25))
    );

    return this.prisma.vitals.create({
      data: {
        patientId,
        bloodPressureSys: dto.bloodPressureSys,
        bloodPressureDia: dto.bloodPressureDia,
        temperature: dto.temperature,
        spo2: dto.spo2,
        pulseRate: dto.pulseRate,
        respiratoryRate: dto.respiratoryRate,
        weight: dto.weight,
        isCritical, // ✅ now ALWAYS boolean
      },
    });
  }

  async findByPatient(patientId: number) {
    return this.prisma.vitals.findMany({
      where: { patientId },
      orderBy: { recordedAt: 'desc' },
    });
  }
}
