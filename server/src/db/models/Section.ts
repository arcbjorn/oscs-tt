import { Model, NotFoundError, QueryBuilder } from 'objection';
import {
  Field, ObjectType,
} from 'type-graphql';
import { objectionError } from '../utils/error.handler';
import { BaseDataArgs, BaseDto, BaseModel } from './Base';
import { Course } from './Course';
import { User } from './User';
import { Note } from './Note';
import { TimeEntry } from './TimeEntry';

@ObjectType({ description: 'Part of Course' })
export class Section extends BaseModel {
  static tableName = 'sections';

  @Field(() => Note, { description: 'Notes, related to Course Section' })
  notes?: Note;

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
    notes: {
      relation: Model.HasManyRelation,
      modelClass: Note,
      join: {
        from: 'sections.id',
        to: 'notes.sectionId',
      },
    },
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

  public static async create(courseId: number, dto: BaseDto, args: BaseDataArgs): Promise<number> {
    try {
      const section = await Section.query().insert({ ...dto });

      await section.$relatedQuery('owner').relate(args.authCtxId);

      await section.$relatedQuery('course').relate(courseId);

      return section.id;
    } catch (error: unknown) {
      throw objectionError(error, 'section.create');
    }
  }

  public static async get(args: BaseDataArgs): Promise<Section> {
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

  public static async update(dto: BaseDto, args: BaseDataArgs): Promise<boolean> {
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

  public static async delete(args: BaseDataArgs): Promise<boolean> {
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

// For creating/updating Subtopic
// @InputType()
// export class SubtopicDto extends BaseDto implements Partial<Subtopic> {}

// For fetching the Subtopic data
// @ArgsType()
// export class SubtopicArgs extends BaseDataArgs {}
