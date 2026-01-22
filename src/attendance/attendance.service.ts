import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { SchoolClass } from '../school-class/entities/school-class.entity';
import { Student, Gender } from '../student/entities/student.entity';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { AttendanceMark, AttendanceStatus } from './entities/attendance-mark.entity';

type Totals = { boys: number; girls: number; total: number };

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceMark)
    private readonly attendanceRepository: Repository<AttendanceMark>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(SchoolClass)
    private readonly classRepository: Repository<SchoolClass>,
  ) {}

  async markAttendance(ownerId: string, markDto: MarkAttendanceDto) {
    const student = await this.studentRepository.findOne({
      where: { id: markDto.studentId },
      relations: ['schoolClass'],
    });
    if (!student || student.schoolClass?.ownerId !== ownerId) {
      throw new NotFoundException('Student not found');
    }

    const existing = await this.attendanceRepository.findOne({
      where: { studentId: markDto.studentId, date: markDto.date },
    });

    if (existing) {
      existing.status = markDto.status;
      return this.attendanceRepository.save(existing);
    }

    const mark = this.attendanceRepository.create({
      studentId: markDto.studentId,
      date: markDto.date,
      status: markDto.status,
    });
    return this.attendanceRepository.save(mark);
  }

  async getMarks(ownerId: string, classId: string, startDate: string, endDate: string) {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }
    return this.getMarksForRange(ownerId, classId, startDate, endDate);
  }

  async getDailySummary(ownerId: string, classId: string, date: string) {
    const { students } = await this.getClassAndStudents(ownerId, classId);
    const marks = await this.getMarksForRange(ownerId, classId, date, date);
    const totals = this.countPresentTotals(students, marks);

    return {
      date,
      totals,
    };
  }

  async getWeeklySummary(ownerId: string, classId: string, year: number, month: number, week: number) {
    const { startDate, endDate } = this.getWeekRange(year, month, week);
    const { students } = await this.getClassAndStudents(ownerId, classId);
    const marks = await this.getMarksForRange(ownerId, classId, startDate, endDate);
    const totals = this.countPresentTotals(students, marks);

    return {
      week,
      range: { startDate, endDate },
      totals,
    };
  }

  async getMonthlySummary(ownerId: string, classId: string, year: number, month: number) {
    const { students } = await this.getClassAndStudents(ownerId, classId);
    const { startDate, endDate } = this.getMonthRange(year, month);
    const marks = await this.getMarksForRange(ownerId, classId, startDate, endDate);
    const totals = this.countPresentTotals(students, marks);
    const studentTotals = this.countStudentTotals(students, marks);
    const schoolDays = this.countDistinctDays(marks);

    const averageBoys = schoolDays ? Number((totals.boys / schoolDays).toFixed(1)) : 0;
    const averageGirls = schoolDays ? Number((totals.girls / schoolDays).toFixed(1)) : 0;
    const averageTotal = schoolDays ? Number((totals.total / schoolDays).toFixed(1)) : 0;

    return {
      month,
      totals,
      schoolDays,
      studentTotals,
      averages: {
        boys: averageBoys,
        girls: averageGirls,
        total: averageTotal,
      },
    };
  }

  async getYearlySummary(ownerId: string, classId: string, year: number) {
    const { students } = await this.getClassAndStudents(ownerId, classId);
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    const marks = await this.getMarksForRange(ownerId, classId, startDate, endDate);
    const studentTotals = this.countStudentTotals(students, marks);

    return {
      year,
      studentTotals,
    };
  }

  async getMonthlyStudentTotals(ownerId: string, classId: string, year: number, month: number) {
    const { students } = await this.getClassAndStudents(ownerId, classId);
    const { startDate, endDate } = this.getMonthRange(year, month);
    const marks = await this.getMarksForRange(ownerId, classId, startDate, endDate);
    return this.countStudentTotals(students, marks);
  }

  private async getClassAndStudents(ownerId: string, classId: string) {
    const schoolClass = await this.classRepository.findOne({ where: { id: classId, ownerId } });
    if (!schoolClass) {
      throw new NotFoundException('Class not found');
    }
    const students = await this.studentRepository.find({
      where: { classId },
      order: { createdAt: 'ASC' },
    });
    return { schoolClass, students };
  }

  private async getMarksForRange(ownerId: string, classId: string, startDate: string, endDate: string) {
    const schoolClass = await this.classRepository.findOne({ where: { id: classId, ownerId } });
    if (!schoolClass) {
      throw new NotFoundException('Class not found');
    }

    return this.attendanceRepository.find({
      where: {
        date: Between(startDate, endDate),
        student: { classId },
      },
      relations: ['student'],
      order: { date: 'ASC' },
    });
  }

  private countPresentTotals(students: Student[], marks: AttendanceMark[]): Totals {
    const totals = { boys: 0, girls: 0, total: 0 };
    const presentMarks = marks.filter((mark) => mark.status === AttendanceStatus.PRESENT);

    const studentById = new Map(students.map((student) => [student.id, student]));
    for (const mark of presentMarks) {
      const student = studentById.get(mark.studentId);
      if (!student) {
        continue;
      }
      if (student.gender === Gender.MALE) {
        totals.boys += 1;
      } else if (student.gender === Gender.FEMALE) {
        totals.girls += 1;
      }
      totals.total += 1;
    }

    return totals;
  }

  private countStudentTotals(students: Student[], marks: AttendanceMark[]) {
    const totals = new Map<string, number>();
    for (const student of students) {
      totals.set(student.id, 0);
    }
    for (const mark of marks) {
      if (mark.status !== AttendanceStatus.PRESENT) {
        continue;
      }
      totals.set(mark.studentId, (totals.get(mark.studentId) ?? 0) + 1);
    }

    return students.map((student) => ({
      studentId: student.id,
      name: student.name,
      admissionNo: student.admissionNo,
      studentNo: student.studentNo,
      gender: student.gender,
      totalPresent: totals.get(student.id) ?? 0,
    }));
  }

  private countDistinctDays(marks: AttendanceMark[]) {
    const unique = new Set(marks.map((mark) => mark.date));
    return unique.size;
  }

  private getMonthRange(year: number, month: number) {
    if (month < 1 || month > 12) {
      throw new BadRequestException('Month must be between 1 and 12');
    }
    const paddedMonth = String(month).padStart(2, '0');
    const startDate = `${year}-${paddedMonth}-01`;
    const daysInMonth = new Date(year, month, 0).getDate();
    const endDate = `${year}-${paddedMonth}-${String(daysInMonth).padStart(2, '0')}`;
    return { startDate, endDate };
  }

  private getWeekRange(year: number, month: number, week: number) {
    if (week < 1 || week > 5) {
      throw new BadRequestException('Week must be between 1 and 5');
    }
    const { startDate: monthStart, endDate: monthEnd } = this.getMonthRange(year, month);
    const startDay = (week - 1) * 7 + 1;
    const daysInMonth = new Date(year, month, 0).getDate();
    const endDay = Math.min(startDay + 6, daysInMonth);
    const paddedMonth = String(month).padStart(2, '0');
    const startDate = `${year}-${paddedMonth}-${String(startDay).padStart(2, '0')}`;
    const endDate = `${year}-${paddedMonth}-${String(endDay).padStart(2, '0')}`;

    if (startDate > monthEnd) {
      throw new BadRequestException('Week range is outside month');
    }
    return { startDate, endDate };
  }
}
