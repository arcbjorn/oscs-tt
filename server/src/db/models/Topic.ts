import { Model, NotFoundError, QueryBuilder } from 'objection';
import {
  Field, ObjectType,
} from 'type-graphql';
import { objectionError } from '../utils/error.handler';
import { BaseModel, BaseDto, BaseDataArgs } from './Base';
import { Subtopic } from './Subtopic';
import { User } from './User';

@ObjectType({ description: 'Academic Topic' })
export class Topic extends BaseModel {
  static tableName = 'topics';

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

  static get modifiers() {
    return {
      findOwner(builder: QueryBuilder<Topic>, ownerId: number) {
        builder.where('ownerId', '=', ownerId);
      },
    };
  }

  public static async create(dto: BaseDto, args: BaseDataArgs): Promise<number> {
    try {
      const topic = await Topic.query().insert({ ...dto });

      await topic.$relatedQuery('owner').relate(args.authCtxId);

      return topic.id;
    } catch (error: unknown) {
      throw objectionError(error, 'topic.create');
    }
  }

  public static async get(args: BaseDataArgs): Promise<Topic> {
    try {
      if (typeof args.id === 'undefined') {
        throw new NotFoundError('Topic ID is missing.');
      }

      const topic = await Topic
        .query()
        .modify('findOwner', args.authCtxId)
        .findById(args.id)
        .withGraphFetched({
          subtopics: true,
        });

      return topic;
    } catch (error: unknown) {
      throw objectionError(error, 'topic.get');
    }
  }

  public static async getAll(args: BaseDataArgs): Promise<Topic[]> {
    try {
      const topics = await Topic
        .query()
        .modify('findOwner', args.authCtxId)
        .withGraphFetched({
          subtopics: true,
        });

      return topics;
    } catch (error: unknown) {
      throw objectionError(error, 'topic.all');
    }
  }

  public static async update(dto: BaseDto, args: BaseDataArgs): Promise<boolean> {
    try {
      if (typeof args.id === 'undefined') {
        throw new NotFoundError('Topic ID is missing.');
      }

      await Topic
        .query()
        .modify('findOwner', args.authCtxId)
        .findById(args.id)
        .patch({ ...dto });

      return true;
    } catch (error: unknown) {
      throw objectionError(error, 'topic.update');
    }
  }

  public static async delete(args: BaseDataArgs): Promise<boolean> {
    try {
      if (typeof args.id === 'undefined') {
        throw new NotFoundError('Topic ID is missing.');
      }

      await Topic
        .query()
        .modify('findOwner', args.authCtxId)
        .deleteById(args.id);

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
