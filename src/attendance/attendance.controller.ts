import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { AttendanceService } from './attendance.service';

type AuthedRequest = Request & { user?: { sub?: string } };

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('mark')
  mark(@Req() request: AuthedRequest, @Body() markDto: MarkAttendanceDto) {
    const ownerId = request.user?.sub;
    return this.attendanceService.markAttendance(String(ownerId), markDto);
  }

  @Get('marks')
  marks(
    @Req() request: AuthedRequest,
    @Query('classId') classId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const ownerId = request.user?.sub;
    return this.attendanceService.getMarks(String(ownerId), classId, startDate, endDate);
  }

  @Get('summary/daily')
  dailySummary(@Req() request: AuthedRequest, @Query('classId') classId: string, @Query('date') date: string) {
    const ownerId = request.user?.sub;
    return this.attendanceService.getDailySummary(String(ownerId), classId, date);
  }

  @Get('summary/weekly')
  weeklySummary(
    @Req() request: AuthedRequest,
    @Query('classId') classId: string,
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('week') week: string,
  ) {
    const ownerId = request.user?.sub;
    return this.attendanceService.getWeeklySummary(String(ownerId), classId, Number(year), Number(month), Number(week));
  }

  @Get('summary/monthly')
  monthlySummary(
    @Req() request: AuthedRequest,
    @Query('classId') classId: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const ownerId = request.user?.sub;
    return this.attendanceService.getMonthlySummary(String(ownerId), classId, Number(year), Number(month));
  }

  @Get('summary/monthly-student-totals')
  monthlyStudentTotals(
    @Req() request: AuthedRequest,
    @Query('classId') classId: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const ownerId = request.user?.sub;
    return this.attendanceService.getMonthlyStudentTotals(String(ownerId), classId, Number(year), Number(month));
  }

  @Get('summary/yearly')
  yearlySummary(@Req() request: AuthedRequest, @Query('classId') classId: string, @Query('year') year: string) {
    const ownerId = request.user?.sub;
    return this.attendanceService.getYearlySummary(String(ownerId), classId, Number(year));
  }
}
