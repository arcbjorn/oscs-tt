/* eslint-disable max-classes-per-file */
import {
  ArgsType,
  Field, InputType, ObjectType,
} from 'type-graphql';
import { BaseModel, BaseDto, BaseDataArgs } from './Base';
import { Specialty } from './Specialty';

@ObjectType({ description: 'Educational Course' })
export class Course extends BaseModel {
  static tableName = 'courses';

  @Field({ description: 'Instructor of Course' })
  instructor?: string;

  @Field({ description: 'Course code' })
  code?: string;

  @Field({ description: 'Institution providing Course' })
  institution?: string;

  @Field(() => Specialty, { description: 'Specific area of academic Sub-topic' })
  specialty?: Specialty;
}

// For creating/updating Course
@InputType()
export class CourseDto extends BaseDto implements Partial<Course> {
  @Field({ nullable: true })
  instructor?: string;

  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  institution?: string;

  @Field({ nullable: true })
  subtopicId?: number;

  @Field({ nullable: true })
  specialtyId?: number;
}

// For fetching the Course data
@ArgsType()
export class CourseArgs extends BaseDataArgs {
  @Field({ nullable: true })
  subtopicId?: number;

  @Field({ nullable: true })
  specialtyId?: number;
}
