import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

 async create(patientId: number, data: { content: string }, user: any) {
  if (!user?.id) {
    throw new BadRequestException('Invalid user session');
  }

  return this.prisma.note.create({
    data: {
      content: data.content,
      patientId,        // ✅ now a number
      staffId: user.id,
    },
  });
}

async findByPatient(patientId: number) {
  return this.prisma.note.findMany({
    where: { patientId }, // ✅ now a number
    orderBy: { createdAt: 'desc' },
    include: {
      staff: {
        select: {
          name: true,
          mobile: true,
        },
      },
    },
  });
}

}
