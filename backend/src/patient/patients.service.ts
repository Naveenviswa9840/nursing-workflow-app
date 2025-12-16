import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Gender } from '@prisma/client';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    age?: number;
    gender: Gender;   // ✅ enum, not string
    mobile?: string;
    address?: string;
  }) {
    return this.prisma.patient.create({
      data: {
        ...data,
      },
    });
  }

  async findAll() {
  return this.prisma.patient.findMany({
    include: {
      vitals: {
        take: 1,
        orderBy: { recordedAt: 'desc' },
        select: {
          isCritical: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}


  async findOne(id: number) {
    if (!id) {
      throw new NotFoundException('Patient ID missing');
    }

    return this.prisma.patient.findUnique({
      where: { id },
      include: {
        vitals: true,
        notes: true,
        documents: true,
        investigations: true,
      },
    });
  }
  async getVitalsHistory(patientId: number) {
  return this.prisma.vitals.findMany({
    where: { patientId },
    orderBy: { recordedAt: 'desc' },
  });
}

}
