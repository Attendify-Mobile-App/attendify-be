import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchoolClassService } from '../school-class/school-class.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly schoolClassService: SchoolClassService,
  ) {}

  async create(ownerId: string, classId: string, createDto: CreateStudentDto) {
    await this.schoolClassService.findOne(ownerId, classId);
    const student = this.studentRepository.create({
      ...createDto,
      classId,
    });
    return this.studentRepository.save(student);
  }

  async findByClass(ownerId: string, classId: string) {
    await this.schoolClassService.findOne(ownerId, classId);
    return this.studentRepository.find({
      where: { classId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(ownerId: string, studentId: string) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      relations: ['schoolClass'],
    });
    if (!student || student.schoolClass?.ownerId !== ownerId) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async update(ownerId: string, studentId: string, updateDto: UpdateStudentDto) {
    const student = await this.findOne(ownerId, studentId);
    const updated = this.studentRepository.merge(student, updateDto);
    return this.studentRepository.save(updated);
  }

  async remove(ownerId: string, studentId: string) {
    const student = await this.findOne(ownerId, studentId);
    await this.studentRepository.remove(student);
    return { deleted: true };
  }
}
