import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSchoolClassDto } from './dto/create-school-class.dto';
import { UpdateSchoolClassDto } from './dto/update-school-class.dto';
import { ClassFilters, SchoolClassService } from './school-class.service';

type AuthedRequest = Request & { user?: { sub?: string } };

@ApiTags('School Classes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('classes')
export class SchoolClassController {
  constructor(private readonly schoolClassService: SchoolClassService) {}

  @Post()
  create(@Req() request: AuthedRequest, @Body() createDto: CreateSchoolClassDto) {
    const ownerId = request.user?.sub;
    return this.schoolClassService.create(String(ownerId), createDto);
  }

  @Get()
  findAll(
    @Req() request: AuthedRequest,
    @Query('schoolName') schoolName?: string,
    @Query('academicYear') academicYear?: string,
    @Query('className') className?: string,
    @Query('division') division?: string,
  ) {
    const ownerId = request.user?.sub;
    const filters: ClassFilters = { schoolName, academicYear, className, division };
    return this.schoolClassService.findAll(String(ownerId), filters);
  }

  @Get(':id')
  findOne(@Req() request: AuthedRequest, @Param('id') id: string) {
    const ownerId = request.user?.sub;
    return this.schoolClassService.findOne(String(ownerId), id);
  }

  @Patch(':id')
  update(@Req() request: AuthedRequest, @Param('id') id: string, @Body() updateDto: UpdateSchoolClassDto) {
    const ownerId = request.user?.sub;
    return this.schoolClassService.update(String(ownerId), id, updateDto);
  }

  @Delete(':id')
  remove(@Req() request: AuthedRequest, @Param('id') id: string) {
    const ownerId = request.user?.sub;
    return this.schoolClassService.remove(String(ownerId), id);
  }
}
