import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentService } from './student.service';

type AuthedRequest = Request & { user?: { sub?: string } };

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('classes/:classId/students')
  create(@Req() request: AuthedRequest, @Param('classId') classId: string, @Body() createDto: CreateStudentDto) {
    const ownerId = request.user?.sub;
    return this.studentService.create(String(ownerId), classId, createDto);
  }

  @Get('classes/:classId/students')
  findByClass(@Req() request: AuthedRequest, @Param('classId') classId: string) {
    const ownerId = request.user?.sub;
    return this.studentService.findByClass(String(ownerId), classId);
  }

  @Get('students/:id')
  findOne(@Req() request: AuthedRequest, @Param('id') id: string) {
    const ownerId = request.user?.sub;
    return this.studentService.findOne(String(ownerId), id);
  }

  @Patch('students/:id')
  update(@Req() request: AuthedRequest, @Param('id') id: string, @Body() updateDto: UpdateStudentDto) {
    const ownerId = request.user?.sub;
    return this.studentService.update(String(ownerId), id, updateDto);
  }

  @Delete('students/:id')
  remove(@Req() request: AuthedRequest, @Param('id') id: string) {
    const ownerId = request.user?.sub;
    return this.studentService.remove(String(ownerId), id);
  }
}
