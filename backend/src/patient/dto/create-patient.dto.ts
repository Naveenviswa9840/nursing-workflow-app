import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export class CreatePatientDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
