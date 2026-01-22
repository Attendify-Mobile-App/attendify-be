import { ApiProperty } from '@nestjs/swagger';

export class CreateSchoolClassDto {
  @ApiProperty({ example: 'Sunshine Public School' })
  schoolName: string;

  @ApiProperty({ example: '2024-2025' })
  academicYear: string;

  @ApiProperty({ example: '6' })
  className: string;

  @ApiProperty({ example: 'A' })
  division: string;
}
