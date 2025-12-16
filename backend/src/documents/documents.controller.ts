import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import type { Response } from 'express'; // ✅ FIX HERE
import { DocumentsService } from './documents.service';

@Controller('patients/:id/documents')
export class DocumentsController {
  constructor(private readonly service: DocumentsService) {}

  @Get()
  findAll(@Param('id', ParseIntPipe) patientId: number) {
    return this.service.findByPatient(patientId);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const unique =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  upload(
    @Param('id', ParseIntPipe) patientId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.service.saveDocument(patientId, file);
  }

  @Get(':docId/view')
  async viewFile(
    @Param('docId', ParseIntPipe) docId: number,
    @Res() res: Response,
  ) {
    const doc = await this.service.findOne(docId);
    const filePath = join(process.cwd(), doc.filePath);

    return res.download(filePath, doc.fileName);
  }
}
