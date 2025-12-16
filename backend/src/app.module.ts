import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PatientsModule } from './patient/patients.module';
import { VitalsModule } from './vitals/vitals.module';
import { NotesModule } from './notes/notes.module';
import { DocumentsModule } from './documents/documents.module';
import { InvestigationsModule } from './investigations/investigations.module';



@Module({
  imports: [AuthModule, PrismaModule,PatientsModule, VitalsModule, NotesModule, DocumentsModule, InvestigationsModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
