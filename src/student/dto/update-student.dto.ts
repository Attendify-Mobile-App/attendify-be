import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '../entities/student.entity';

export class UpdateStudentDto {
  @ApiPropertyOptional({ example: 'ADM-1023' })
  admissionNo?: string;

  @ApiPropertyOptional({ example: 'STU-45' })
  studentNo?: string;

  @ApiPropertyOptional({ example: 'Riya Sharma' })
  name?: string;

  @ApiPropertyOptional({ example: '2012-05-18' })
  dateOfBirth?: string;

  @ApiPropertyOptional({ enum: Gender, example: Gender.FEMALE })
  gender?: Gender;
}
