import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SchoolClass } from '../../school-class/entities/school-class.entity';
import { AttendanceMark } from '../../attendance/entities/attendance-mark.entity';

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  admissionNo: string;

  @Column()
  studentNo: string;

  @Column()
  name: string;

  @Column({ type: 'date' })
  dateOfBirth: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column()
  classId: string;

  @ManyToOne(() => SchoolClass, (schoolClass) => schoolClass.students, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classId' })
  schoolClass: SchoolClass;

  @OneToMany(() => AttendanceMark, (mark) => mark.student)
  marks: AttendanceMark[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
