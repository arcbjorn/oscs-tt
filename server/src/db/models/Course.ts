/* eslint-disable max-classes-per-file */
import { Model } from 'objection';
import {
  ArgsType,
  Field, InputType, ObjectType,
} from 'type-graphql';
import { BaseDataArgs } from './BaseDataArgs';
import { Specialty } from './Specialty';

@ObjectType({ description: 'Educational Course' })
export class Course extends Model {
  static tableName = 'courses';

  @Field({ description: 'Title of the course' })
  title!: string;

  @Field({ nullable: false, description: 'Description' })
  description?: string;

  @Field({ description: 'Specific area of academic Sub-topic' })
  specialty?: Specialty;
}

// For creating/updating Course
@InputType()
export class CourseDto implements Partial<Course> {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  ownerId?: string;

  @Field({ nullable: true })
  specialtyId?: number;
}

// For fetching the Course data
@ArgsType()
export class CourseArgs extends BaseDataArgs {
  @Field({ nullable: true })
  specialtyId?: number;
}
