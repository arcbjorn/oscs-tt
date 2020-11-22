import { Model, NotFoundError, QueryBuilder } from 'objection';
import {
  ArgsType,
  Field, ObjectType,
} from 'type-graphql';
import { objectionError } from '../utils/error.handler';
import { BaseDataArgs, BaseDto, BaseModel } from './Base';
import { Course } from './Course';
import { User } from './User';
import { TimeEntry } from './TimeEntry';

@ObjectType({ description: 'Part of Course' })
export class Section extends BaseModel {
  static tableName = 'sections';

  @Field(() => Course, { description: 'Course, which contains Section' })
  course?: Course;

  @Field(() => TimeEntry, { nullable: true, description: 'Time spent on Section of Course' })
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
    timeEntries: {
      relation: Model.HasManyRelation,
      modelClass: TimeEntry,
      join: {
        from: 'sections.id',
        to: 'timeEntries.courseId',
      },
    },
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'sections.ownerId',
        to: 'users.id',
      },
    },
  });

  static get modifiers() {
    return {
      findOwner(builder: QueryBuilder<Section>, ownerId: number) {
        builder.where('ownerId', '=', ownerId);
      },
    };
  }

  public static async create(dto: BaseDto, args: SectionArgs): Promise<number> {
    try {
      if (typeof args.courseId === 'undefined') {
        throw new Error('Course ID of Section is missing.');
      }

      const section = await Section.query().insert({ ...dto });

      await section.$relatedQuery('owner').relate(args.authCtxId);

      await section.$relatedQuery('course').relate(args.courseId);

      return section.id;
    } catch (error: unknown) {
      throw objectionError(error, 'section.create');
    }
  }

  public static async get(args: SectionArgs): Promise<Section> {
    try {
      if (typeof args.id === 'undefined') {
        throw new NotFoundError('Section ID is missing.');
      }

      const section = await Section
        .query()
        .modify('findOwner', args.authCtxId)
        .findById(args.id)
        .withGraphFetched({
          notes: true,
        });

      return section;
    } catch (error: unknown) {
      throw objectionError(error, 'section.get');
    }
  }

  public static async update(dto: BaseDto, args: SectionArgs): Promise<boolean> {
    try {
      if (typeof args.id === 'undefined') {
        throw new NotFoundError('Section ID is missing.');
      }

      await Section
        .query()
        .modify('findOwner', args.authCtxId)
        .findById(args.id)
        .patch({ ...dto });

      return true;
    } catch (error: unknown) {
      throw objectionError(error, 'section.update');
    }
  }

  public static async delete(args: SectionArgs): Promise<boolean> {
    try {
      if (typeof args.id === 'undefined') {
        throw new NotFoundError('Section ID is missing.');
      }

      await Section
        .query()
        .modify('findOwner', args.authCtxId)
        .deleteById(args.id);

      return true;
    } catch (error: unknown) {
      throw objectionError(error, 'section.delete');
    }
  }
}

// For fetching the Section data
@ArgsType()
export class SectionArgs extends BaseDataArgs {
  @Field({ nullable: true })
  courseId?: number;
}
