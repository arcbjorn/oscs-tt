/* eslint-disable max-classes-per-file */
import { Model } from 'objection';
import {
  ArgsType,
  Field, InputType, ObjectType,
} from 'type-graphql';
import { BaseDataArgs } from './BaseDataArgs';
import { Specialty } from './Specialty';

@ObjectType({ description: 'Academic Sub-topic' })
export class Subtopic extends Model {
  static tableName = 'subtopics';

  @Field({ description: 'Title of the subtopic' })
  title!: string;

  @Field({ nullable: false, description: 'Description' })
  description?: string;

  @Field({ description: 'Part of academic topic' })
  topic?: Topic;

  @Field({ description: 'Part of academic topic' })
  specialties?: Specialty[];
}

// For creating/updating Subtopic
@InputType()
export class SubtopicDto implements Partial<Subtopic> {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  ownerId?: string;

  @Field({ nullable: true })
  topicId?: number;
}

// For fetching the Subtopic data
@ArgsType()
export class SubtopicArgs extends BaseDataArgs {
  @Field({ nullable: true })
  topicId?: number;
}
