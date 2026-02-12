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
import { User } from '../../user/entities/user.entity';
import { Student } from '../../student/entities/student.entity';

@Entity()
export class SchoolClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  schoolName: string;

  @Column()
  academicYear: string;

  @Column()
  className: string;

  @Column()
  division: string;

  @Column()
  ownerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => Student, (student) => student.schoolClass)
  students: Student[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
