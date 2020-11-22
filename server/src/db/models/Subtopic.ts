import { Model, NotFoundError, QueryBuilder } from 'objection';
import {
  ArgsType,
  Field, ObjectType,
} from 'type-graphql';
import { objectionError } from '../utils/error.handler';
import { BaseDataArgs, BaseDto, BaseModel } from './Base';
import { Course } from './Course';
import { Specialty } from './Specialty';
import { TimeEntry } from './TimeEntry';
import { Topic } from './Topic';
import { User } from './User';

@ObjectType({ description: 'Academic Sub-topic' })
export class Subtopic extends BaseModel {
  static tableName = 'subtopics';

  @Field(() => Topic, { description: 'One of the main fields of knowledge' })
  topic?: Topic;

  @Field(() => [Specialty], { description: 'Specialties' })
  specialties?: Specialty[];

  @Field(() => [Course], { description: 'Courses without specialty' })
  courses?: Course[];

  @Field(() => TimeEntry, { nullable: true, description: 'Time spent on Subtopic' })
  timeEntries?: TimeEntry[];

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
    specialties: {
      relation: Model.HasManyRelation,
      modelClass: Specialty,
      join: {
        from: 'subtopics.id',
        to: 'specialties.subtopicId',
      },
    },
    courses: {
      relation: Model.HasManyRelation,
      modelClass: Course,
      join: {
        from: 'subtopics.id',
        to: 'courses.subtopicId',
      },
    },
    timeEntries: {
      relation: Model.HasManyRelation,
      modelClass: TimeEntry,
      join: {
        from: 'subtopics.id',
        to: 'timeEntries.subtopicId',
      },
    },
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'subtopics.ownerId',
        to: 'users.id',
      },
    },
  });

  static get modifiers() {
    return {
      findOwner(builder: QueryBuilder<Subtopic>, ownerId: number) {
        builder.where('ownerId', '=', ownerId);
      },
    };
  }

  public static async create(dto: BaseDto, args: SubtopicArgs): Promise<number> {
    try {
      if (typeof args.topicId === 'undefined') {
        throw new Error('Topic ID of new Subtopic is missing.');
      }

      const subtopic = await Subtopic.query().insert({ ...dto });

      await subtopic.$relatedQuery('owner').relate(args.authCtxId);

      await subtopic.$relatedQuery('topic').relate(args.topicId);

      return subtopic.id;
    } catch (error: unknown) {
      throw objectionError(error, 'subtopic.create');
    }
  }

  public static async get(args: SubtopicArgs): Promise<Subtopic> {
    try {
      if (typeof args.id === 'undefined') {
        throw new Error('Subtopic ID is missing.');
      }

      const subtopic = await Subtopic
        .query()
        .modify('findOwner', args.authCtxId)
        .findById(args.id)
        .withGraphFetched({
          specialties: true,
          courses: true,
        });

      return subtopic;
    } catch (error: unknown) {
      throw objectionError(error, 'subtopic.get');
    }
  }

  public static async getAll(args: SubtopicArgs): Promise<Subtopic[]> {
    try {
      const subtopics = await Subtopic
        .query()
        .modify('findOwner', args.authCtxId)
        .withGraphFetched({
          specialties: true,
          courses: true,
        });

      return subtopics;
    } catch (error: unknown) {
      throw objectionError(error, 'subtopic.all');
    }
  }

  public static async update(dto: BaseDto, args: SubtopicArgs): Promise<boolean> {
    try {
      if (typeof args.id === 'undefined') {
        throw new NotFoundError('Subtopic ID is missing.');
      }

      await Subtopic
        .query()
        .modify('findOwner', args.authCtxId)
        .findById(args.id)
        .patch({ ...dto });

      return true;
    } catch (error: unknown) {
      throw objectionError(error, 'subtopic.update');
    }
  }

  public static async delete(args: SubtopicArgs): Promise<boolean> {
    try {
      if (typeof args.id === 'undefined') {
        throw new NotFoundError('Subtopic ID is missing.');
      }

      await Subtopic
        .query()
        .modify('findOwner', args.authCtxId)
        .deleteById(args.id);

      return true;
    } catch (error: unknown) {
      throw objectionError(error, 'subtopic.delete');
    }
  }
}

// For fetching the Subtopic data
@ArgsType()
export class SubtopicArgs extends BaseDataArgs {
  @Field({ nullable: true })
  topicId?: number;
}
