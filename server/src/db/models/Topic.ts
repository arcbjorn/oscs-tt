/* eslint-disable max-classes-per-file */
import {
  ArgsType,
  Field, InputType, ObjectType,
} from 'type-graphql';
import { BaseModel, BaseDto, BaseDataArgs } from './Base';
import { Subtopic } from './Subtopic';

@ObjectType({ description: 'Academic Topic' })
export class Topic extends BaseModel {
  static tableName = 'topics';

  @Field(() => Subtopic, { description: 'Components' })
  subtopics?: Subtopic[];
}

// For creating/updating Topic
@InputType()
export class TopicDto extends BaseDto implements Partial<Topic> {
  @Field({ nullable: true })
  name?: string;
}

// For fetching the Topic data
@ArgsType()
export class TopicArgs extends BaseDataArgs {
  @Field({ nullable: true })
  topicId?: number;
}
