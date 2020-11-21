import { Model } from 'objection';
import {
  Field, ObjectType,
} from 'type-graphql';
import { objectionError } from '../utils/error.handler';
import { BaseModel, BaseDto } from './Base';
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

  public static async create(dto: BaseDto): Promise<number> {
    try {
      const topic = await Topic.query().insert({ ...dto });

      return topic.id;
    } catch (error: unknown) {
      throw objectionError(error, 'topic.create');
    }
  }

  public static async get(id: number): Promise<Topic> {
    try {
      const topic = Topic
        .query()
        .findById(id)
        .withGraphFetched({
          subtopics: true,
        });

      return topic;
    } catch (error: unknown) {
      throw objectionError(error, 'topic.get');
    }
  }

  public static async getAll(): Promise<Topic[]> {
    try {
      const topics = Topic
        .query()
        .withGraphFetched({
          subtopics: true,
        });

      return topics;
    } catch (error: unknown) {
      throw objectionError(error, 'topic.all');
    }
  }

  public static async update(id: number, dto: BaseDto): Promise<boolean> {
    try {
      await Topic.query().findById(id).patch({ ...dto });

      return true;
    } catch (error: unknown) {
      throw objectionError(error, 'topic.update');
    }
  }

  public static async delete(id: number): Promise<boolean> {
    try {
      await Topic.query().deleteById(id);

      return true;
    } catch (error: unknown) {
      throw objectionError(error, 'topic.delete');
    }
  }
}

// For creating/updating Topic
// @InputType()
// export class TopicDto extends BaseDto implements Partial<Topic> {
//   @Field({ nullable: true })
//   department?: string;
// }

// For fetching the Topic data
// @ArgsType()
// export class TopicArgs extends BaseDataArgs {}
