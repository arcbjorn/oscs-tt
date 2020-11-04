/* eslint-disable max-classes-per-file */
import { Model } from 'objection';
import {
  ArgsType,
  Field, InputType, ObjectType,
} from 'type-graphql';
import { BaseDataArgs } from './BaseDataArgs';
import { Subtopic } from './Subtopic';
import { TimeEntry } from './TimeEntry';

@ObjectType({ description: 'Academic Specialty' })
export class Specialty extends Model {
  static tableName = 'specialties';

  @Field({ description: 'Title of the specialty' })
  title!: string;

  @Field({ nullable: false, description: 'Description' })
  description?: string;

  @Field({ description: 'Part of academic topic' })
  topic?: Subtopic;

  @Field({ description: 'Part of academic topic' })
  timeEntries?: TimeEntry[];
}

// For creating/updating Specialty
@InputType()
export class SpecialtyDto implements Partial<Specialty> {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  ownerId?: string;

  @Field({ nullable: true })
  subtopicId?: number;
}

// For fetching the Specialty data
@ArgsType()
export class SpecialtyArgs extends BaseDataArgs {
  @Field({ nullable: true })
  subtopicId?: number;
}
