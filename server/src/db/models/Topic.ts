import { ValidationError, Model } from 'objection';

import {
  ArgsType,
  Field, InputType, ObjectType,
} from 'type-graphql';
import { BaseModel, BaseDto, BaseDataArgs } from './Base';
import { Subtopic } from './Subtopic';
import { User } from './User';

@ObjectType({ description: 'Academic Topic' })
export class Topic extends BaseModel {
  static tableName = 'topics';

  @Field()
  department?: string;

  @Field(() => Subtopic, { description: 'Components' })
  subtopics?: Subtopic[];

  static jsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      id: { type: 'integer' },
      name: { type: 'string', min: 1, max: 127 },
      description: { type: 'string', min: 1, max: 127 },
    },
  };

  static relationMappings = () => ({
    subtopics: {
      relation: Model.HasManyRelation,
      modelClass: Subtopic,
      join: {
        from: 'topics.id',
        to: 'subtopics.topicId',
      },
    },
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'topics.ownerId',
        to: 'users.id',
      },
    },
  });

  public static async create(dto: TopicDto) {
    try {
      const topic = await Topic.query().insert({ ...dto });

      return topic.id;
    } catch (e: unknown) {
      if (e instanceof ValidationError) {
        throw new ValidationError({
          statusCode: e.statusCode,
          message: 'topics.create',
          data: e.data,
          type: e.type,
        });
      }
      throw new Error('topics.create');
    }
  }

  public static async update(id: number, dto: TopicDto) {
    try {
      await Topic.query().findById(id).patch({ ...dto });

      return true;
    } catch (e: unknown) {
      if (e instanceof ValidationError) {
        throw new ValidationError({
          statusCode: e.statusCode,
          message: 'topics.update',
          data: e.data,
          type: e.type,
        });
      }
      throw new Error('topics.update');
    }
  }

  public static async delete(id: number) {
    try {
      await Topic.query().deleteById(id);

      return true;
    } catch (e: unknown) {
      if (e instanceof ValidationError) {
        throw new ValidationError({
          statusCode: e.statusCode,
          message: 'topics.delete',
          data: e.data,
          type: e.type,
        });
      }
      throw new Error('topics.delete');
    }
  }
}

// For creating/updating Topic
@InputType()
export class TopicDto extends BaseDto implements Partial<Topic> {
  @Field({ nullable: true })
  department?: string;
}

// For fetching the Topic data
@ArgsType()
export class TopicArgs extends BaseDataArgs {
  @Field({ nullable: true })
  topicId?: number;
}
