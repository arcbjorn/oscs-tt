/* eslint-disable max-classes-per-file */
import {
  ArgsType,
  Field, InputType, ObjectType,
} from 'type-graphql';
import { BaseDataArgs, BaseDto, BaseModel } from './Base';
import { Specialty } from './Specialty';
import { Topic } from './Topic';

@ObjectType({ description: 'Academic Sub-topic' })
export class Subtopic extends BaseModel {
  static tableName = 'subtopics';

  @Field(() => Topic, { description: 'One of the main fields of knowledge' })
  topic?: Topic;

  @Field(() => [Specialty], { description: 'Components' })
  specialties?: Specialty[];
}

// For creating/updating Subtopic
@InputType()
export class SubtopicDto extends BaseDto implements Partial<Subtopic> {
  @Field({ nullable: true })
  topicId?: number;
}

// For fetching the Subtopic data
@ArgsType()
export class SubtopicArgs extends BaseDataArgs {
  @Field({ nullable: true })
  topicId?: number;
}
