/* eslint-disable max-classes-per-file */
import {
  ArgsType,
  Field, InputType, ObjectType,
} from 'type-graphql';
import { BaseModel, BaseDto, BaseDataArgs } from './Base';
import { Subtopic } from './Subtopic';
import { TimeEntry } from './TimeEntry';

@ObjectType({ description: 'Academic Specialty' })
export class Specialty extends BaseModel {
  static tableName = 'specialties';

  @Field(() => Subtopic, { description: 'Part of academic Topic' })
  subtopic?: Subtopic;

  @Field(() => TimeEntry, { description: 'Periods of time spent on this specialty' })
  timeEntries?: TimeEntry[];
}

// For creating/updating Specialty
@InputType()
export class SpecialtyDto extends BaseDto implements Partial<Specialty> {
  @Field({ nullable: true })
  subtopicId?: number;
}

// For fetching the Specialty data
@ArgsType()
export class SpecialtyArgs extends BaseDataArgs {
  @Field({ nullable: true })
  subtopicId?: number;
}
