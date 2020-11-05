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

  @Field(() => Specialty, { description: 'Specific area of academic Sub-topic' })
  specialty?: Specialty;
}

// For creating/updating Course
@InputType()
export class CourseDto extends BaseDto implements Partial<Course> {
  @Field({ nullable: true })
  specialtyId?: number;
}

// For fetching the Course data
@ArgsType()
export class CourseArgs extends BaseDataArgs {
  @Field({ nullable: true })
  specialtyId?: number;
}
