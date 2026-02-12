import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '../entities/attendance-mark.entity';

export class MarkAttendanceDto {
  @ApiProperty({ example: '0f47a0c0-0f9b-4e90-9fdd-2a7d85b5b014' })
  studentId: string;

  @ApiProperty({ example: '2026-01-22' })
  date: string;

  @ApiProperty({ enum: AttendanceStatus, example: AttendanceStatus.PRESENT })
  status: AttendanceStatus;
}
