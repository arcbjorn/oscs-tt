import { Model, NotFoundError, QueryBuilder } from 'objection';
import {
  ArgsType,
  Field, ObjectType,
} from 'type-graphql';
import { objectionError } from '../utils/error.handler';
import { BaseModel, BaseDto } from './Base';
import { Subtopic } from './Subtopic';
import { TimeEntry } from './TimeEntry';
import { User } from './User';

// For fetching the Specialty data
@ArgsType()
export class SpecialtyArgs {
  @Field()
  id?: number;

  @Field({ nullable: true })
  authCtxId!: number;

  @Field({ nullable: true })
  subtopicId?: number;
}

@ObjectType({ description: 'Academic Specialty' })
export class Specialty extends BaseModel {
  static tableName = 'specialties';

  @Field(() => Subtopic, { description: 'Part of academic Topic' })
  subtopic?: Subtopic;

  @Field(() => TimeEntry, { description: 'Periods of time spent on this Specialty' })
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
        from: 'specialties.id',
        to: 'timeEntries.specialtyId',
      },
    },
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'specialties.ownerId',
        to: 'users.id',
      },
    },
  });

  static get modifiers() {
    return {
      findOwner(builder: QueryBuilder<Specialty>, ownerId: number) {
        builder.where('ownerId', '=', ownerId);
      },
    };
  }

  public static async create(dto: BaseDto, args: SpecialtyArgs): Promise<number> {
    try {
      if (typeof args.subtopicId === 'undefined') {
        throw new Error('Topic ID of new Subtopic is missing.');
      }

      const specialty = await Specialty.query().insert({ ...dto });

      await specialty.$relatedQuery('owner').relate(args.authCtxId);

      await specialty.$relatedQuery('subtopic').relate(args.subtopicId);

      return specialty.id;
    } catch (error: unknown) {
      throw objectionError(error, 'specialty.create');
    }
  }

  public static async get(args: SpecialtyArgs): Promise<Specialty> {
    try {
      if (typeof args.id === 'undefined') {
        throw new NotFoundError('Specialty ID is missing.');
      }

      const specialty = await Specialty
        .query()
        .modify('findOwner', args.authCtxId)
        .findById(args.id)
        .withGraphFetched({
          courses: true,
        });

      return specialty;
    } catch (error: unknown) {
      throw objectionError(error, 'specialty.get');
    }
  }

  public static async getAll(args: SpecialtyArgs): Promise<Specialty[]> {
    try {
      const specialties = await Specialty
        .query()
        .modify('findOwner', args.authCtxId)
        .withGraphFetched({
          courses: true,
        });

      return specialties;
    } catch (error: unknown) {
      throw objectionError(error, 'specialty.all');
    }
  }

  public static async update(dto: BaseDto, args: SpecialtyArgs): Promise<boolean> {
    try {
      if (typeof args.id === 'undefined') {
        throw new NotFoundError('Specialty ID is missing.');
      }

      await Specialty
        .query()
        .modify('findOwner', args.authCtxId)
        .findById(args.id)
        .patch({ ...dto });

      return true;
    } catch (error: unknown) {
      throw objectionError(error, 'specialty.update');
    }
  }

  public static async delete(args: SpecialtyArgs): Promise<boolean> {
    try {
      if (typeof args.id === 'undefined') {
        throw new NotFoundError('Specialty ID is missing.');
      }

      await Specialty
        .query()
        .modify('findOwner', args.authCtxId)
        .deleteById(args.id);

      return true;
    } catch (error: unknown) {
      throw objectionError(error, 'specialty.delete');
    }
  }
}
