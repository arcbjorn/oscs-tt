/* eslint-disable max-classes-per-file */
import { Model } from 'objection';
import {
  ArgsType,
  Field, InputType, ObjectType,
} from 'type-graphql';
import { BaseDataArgs } from './BaseDataArgs';
import { Course } from './Course';
import { Specialty } from './Specialty';

@ObjectType({ description: 'Time entry of the user' })
export class TimeEntry extends Model {
  static tableName = 'timeEntries';

  @Field({ description: 'Owner' })
  owner!: User;

  @Field({ description: 'Title' })
  title!: string;

  @Field({ nullable: false, description: 'Description' })
  description?: string;

  @Field({ description: 'Specific area of academic Sub-topic' })
  specialty?: Specialty;

  @Field({ description: 'Optional educational Course' })
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
export class TimeEntryDto implements Partial<TimeEntry> {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  ownerId?: number;

  @Field({ nullable: true })
  specialtyId?: number;
}

// For fetching the TimeEntry data
@ArgsType()
export class TimeEntriesArgs extends BaseDataArgs {
  @Field({ nullable: true })
  specialtyId?: number;
}
