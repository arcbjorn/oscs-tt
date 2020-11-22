/* eslint-disable no-shadow */
import { Model, NotFoundError, QueryBuilder } from 'objection';
import {
  ArgsType,
  Field, InputType, ObjectType, registerEnumType,
} from 'type-graphql';
import { objectionError } from '../utils/error.handler';
import { BaseModel, BaseDto, BaseDataArgs } from './Base';
import { Course } from './Course';
import { Section } from './Section';
import { Specialty } from './Specialty';
import { User } from './User';

export enum TimeEntrySource {
  SPECIALTY,
  COURSE,
  SECTION
}

registerEnumType(TimeEntrySource, {
  name: 'TimeEntrySource',
});

@ObjectType({ description: 'Time entry of the user' })
export class TimeEntry extends BaseModel {
  static tableName = 'timeEntries';

  @Field(() => TimeEntrySource, { nullable: false })
  source!: TimeEntrySource;

  @Field(() => Specialty, { description: 'Specific area of academic Sub-topic' })
  specialty?: Specialty;

  @Field(() => Course, { description: 'Optional educational Course' })
  course?: Course;

  @Field(() => Section, { description: 'Optional educational Course Section' })
  section?: Section;

  @Field()
  startDate!: Date;

  @Field()
  endDate!: Date;

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
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'timeEntries.ownerId',
        to: 'users.id',
      },
    },
  });

  static get modifiers() {
    return {
      findOwner(builder: QueryBuilder<TimeEntry>, ownerId: number) {
        builder.where('ownerId', '=', ownerId);
      },
    };
  }

  public static async create(dto: TimeEntryDto, args: TimeEntryArgs): Promise<number> {
    try {
      if (typeof args.sourceId === 'undefined') {
        throw new NotFoundError('Time Entry source ID is missing.');
      }

      let source: string;

      const timeEntry = await TimeEntry.query().insert({ ...dto });

      switch (dto.source) {
        case TimeEntrySource.SPECIALTY:
          source = 'specialty';
          break;
        case TimeEntrySource.COURSE:
          source = 'course';
          break;
        case TimeEntrySource.SECTION:
          source = 'section';
          break;
        default:
          source = '';
      }

      await timeEntry.$relatedQuery(source).relate(args.sourceId);

      await timeEntry.$relatedQuery('owner').relate(args.authCtxId);

      return timeEntry.id;
    } catch (error: unknown) {
      throw objectionError(error, 'timeEntry.create');
    }
  }

  public static async get(args: BaseDataArgs): Promise<TimeEntry> {
    try {
      if (typeof args.id === 'undefined') {
        throw new NotFoundError('Time Entry ID is missing.');
      }

      const timeEntry = await TimeEntry
        .query()
        .modify('findOwner', args.authCtxId)
        .findById(args.id);

      return timeEntry;
    } catch (error: unknown) {
      throw objectionError(error, 'timeEntry.get');
    }
  }

  public static async update(dto: TimeEntryDto, args: BaseDataArgs): Promise<boolean> {
    try {
      if (typeof args.id === 'undefined') {
        throw new NotFoundError('Time Entry ID is missing.');
      }

      await TimeEntry
        .query()
        .modify('findOwner', args.authCtxId)
        .findById(args.id)
        .patch({ ...dto });

      return true;
    } catch (error: unknown) {
      throw objectionError(error, 'timeEntry.update');
    }
  }

  public static async delete(args: BaseDataArgs): Promise<boolean> {
    try {
      if (typeof args.id === 'undefined') {
        throw new NotFoundError('Time Entry ID is missing.');
      }

      await TimeEntry
        .query()
        .modify('findOwner', args.authCtxId)
        .deleteById(args.id);

      return true;
    } catch (error: unknown) {
      throw objectionError(error, 'timeEntry.delete');
    }
  }
}

// For creating/updating TimeEntryDto
@InputType()
export class TimeEntryDto extends BaseDto implements Partial<TimeEntry> {
  @Field({ nullable: false })
  source!: TimeEntrySource;
}

// For fetching the TimeEntry data
@ArgsType()
export class TimeEntryArgs extends BaseDataArgs {
  @Field()
  sourceId?: number;
}
