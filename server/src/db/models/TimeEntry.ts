/* eslint-disable max-classes-per-file */
import { Model } from 'objection';
import {
  ArgsType,
  Field, InputType, ObjectType,
} from 'type-graphql';

@ObjectType({ description: 'Object representing time entry' })
export class TimeEntry extends Model {
  static tableName = 'timeEntries';

  @Field()
  title!: string;

  @Field({ nullable: false, description: 'The time entry description' })
  description?: string;

  @Field()
  creationDate!: Date;

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

@InputType()
export class TimeEntryDto implements Partial<TimeEntry> {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;
}

@ArgsType()
export class TimeEntriesArgs {
  @Field()
  id?: number;

  @Field({ nullable: true })
  title?: string;
}
