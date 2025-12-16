import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvestigationsService {
  constructor(private prisma: PrismaService) {}

  create(patientId: number, data: any) {
    return this.prisma.investigation.create({
      data: {
        patientId,
        testName: data.testName,
        status: 'PENDING',
      },
    });
  }

  findByPatient(patientId: number) {
    return this.prisma.investigation.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  updateStatus(id: number, status: 'PENDING' | 'COMPLETED') {
    return this.prisma.investigation.update({
      where: { id },
      data: { status },
    });
  }
}
