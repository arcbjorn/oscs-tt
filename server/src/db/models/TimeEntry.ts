/* eslint-disable max-classes-per-file */
import {
  ArgsType,
  Field, InputType, ObjectType,
} from 'type-graphql';
import { BaseModel, BaseDto, BaseDataArgs } from './Base';
import { Course } from './Course';
import { Specialty } from './Specialty';

@ObjectType({ description: 'Time entry of the user' })
export class TimeEntry extends BaseModel {
  static tableName = 'timeEntries';

  @Field(() => Specialty, { description: 'Specific area of academic Sub-topic' })
  specialty?: Specialty;

  @Field(() => Course, { description: 'Optional educational Course' })
  course?: Course;

  @Field()
  startDate!: Date;

  @Field()
  endDate!: Date;

  // @Field((type) => Float, { nullable: true })
  // get averageRating(): number | null {
  //   const ratingsCount = this.ratings.length;
  //   if (ratingsCount === 0) {
  //     return null;
  //   }
  //   const ratingsSum = this.ratings.reduce((a, b) => a + b, 0);
  //   return ratingsSum / ratingsCount;
  // }
}

// For creating/updating TimeEntryDto
@InputType()
export class TimeEntryDto extends BaseDto implements Partial<TimeEntry> {
  @Field({ nullable: true })
  specialtyId?: number;
}

// For fetching the TimeEntry data
@ArgsType()
export class TimeEntryArgs extends BaseDataArgs {
  @Field({ nullable: true })
  specialtyId?: number;
}
