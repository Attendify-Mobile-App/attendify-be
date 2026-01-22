import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../entities/student.entity';

export class CreateStudentDto {
  @ApiProperty({ example: 'ADM-1023' })
  admissionNo: string;

  @ApiProperty({ example: 'STU-45' })
  studentNo: string;

  @ApiProperty({ example: 'Riya Sharma' })
  name: string;

  @ApiProperty({ example: '2012-05-18' })
  dateOfBirth: string;

  @ApiProperty({ enum: Gender, example: Gender.FEMALE })
  gender: Gender;
}
