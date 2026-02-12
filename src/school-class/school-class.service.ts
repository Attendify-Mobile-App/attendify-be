import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateSchoolClassDto } from './dto/create-school-class.dto';
import { UpdateSchoolClassDto } from './dto/update-school-class.dto';
import { SchoolClass } from './entities/school-class.entity';

export type ClassFilters = {
  schoolName?: string;
  academicYear?: string;
  className?: string;
  division?: string;
};

@Injectable()
export class SchoolClassService {
  constructor(
    @InjectRepository(SchoolClass)
    private readonly schoolClassRepository: Repository<SchoolClass>,
  ) {}

  async create(ownerId: string, createDto: CreateSchoolClassDto) {
    const schoolClass = this.schoolClassRepository.create({
      ...createDto,
      ownerId,
    });
    return this.schoolClassRepository.save(schoolClass);
  }

  async findAll(ownerId: string, filters: ClassFilters = {}) {
    const where: FindOptionsWhere<SchoolClass> = { ownerId };

    if (filters.schoolName) {
      where.schoolName = ILike(`%${filters.schoolName}%`);
    }
    if (filters.academicYear) {
      where.academicYear = ILike(`%${filters.academicYear}%`);
    }
    if (filters.className) {
      where.className = ILike(`%${filters.className}%`);
    }
    if (filters.division) {
      where.division = ILike(`%${filters.division}%`);
    }

    return this.schoolClassRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(ownerId: string, id: string) {
    const schoolClass = await this.schoolClassRepository.findOne({
      where: { id, ownerId },
    });
    if (!schoolClass) {
      throw new NotFoundException('Class not found');
    }
    return schoolClass;
  }

  async update(ownerId: string, id: string, updateDto: UpdateSchoolClassDto) {
    const schoolClass = await this.findOne(ownerId, id);
    const updated = this.schoolClassRepository.merge(schoolClass, updateDto);
    return this.schoolClassRepository.save(updated);
  }

  async remove(ownerId: string, id: string) {
    const schoolClass = await this.findOne(ownerId, id);
    await this.schoolClassRepository.remove(schoolClass);
    return { deleted: true };
  }
}
