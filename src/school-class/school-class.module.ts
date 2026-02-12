import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolClass } from './entities/school-class.entity';
import { SchoolClassController } from './school-class.controller';
import { SchoolClassService } from './school-class.service';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolClass])],
  controllers: [SchoolClassController],
  providers: [SchoolClassService],
  exports: [SchoolClassService],
})
export class SchoolClassModule {}
