import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async saveDocument(patientId: number, file: Express.Multer.File) {
    return this.prisma.document.create({
      data: {
        patientId,
        fileName: file.originalname,      // 👈 ORIGINAL NAME
        filePath: `uploads/${file.filename}`, // 👈 STORED PATH
        fileType: file.mimetype,
      },
    });
  }

  async findByPatient(patientId: number) {
    return this.prisma.document.findMany({
      where: { patientId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }
}
