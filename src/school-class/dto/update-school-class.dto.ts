import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSchoolClassDto {
  @ApiPropertyOptional({ example: 'Sunshine Public School' })
  schoolName?: string;

  @ApiPropertyOptional({ example: '2024-2025' })
  academicYear?: string;

  @ApiPropertyOptional({ example: '6' })
  className?: string;

  @ApiPropertyOptional({ example: 'A' })
  division?: string;
}
