import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolClass } from '../school-class/entities/school-class.entity';
import { Student } from '../student/entities/student.entity';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AttendanceMark } from './entities/attendance-mark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceMark, Student, SchoolClass])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
