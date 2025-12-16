import { IsInt, IsOptional, IsNumber } from 'class-validator';

export class CreateVitalsDto {
  @IsOptional() @IsInt()
  bloodPressureSys?: number;

  @IsOptional() @IsInt()
  bloodPressureDia?: number;

  @IsOptional() @IsNumber()
  temperature?: number;

  @IsOptional() @IsInt()
  spo2?: number;

  @IsOptional() @IsInt()
  pulseRate?: number;

  @IsOptional() @IsInt()
  respiratoryRate?: number;

  @IsOptional() @IsNumber()
  weight?: number;
}
