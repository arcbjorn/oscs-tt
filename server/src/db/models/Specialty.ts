import { Model } from 'objection';
import {
  Field, ObjectType,
} from 'type-graphql';
import { objectionError } from '../utils/error.handler';
import { BaseModel, BaseDto } from './Base';
import { Subtopic } from './Subtopic';
import { TimeEntry } from './TimeEntry';
import { User } from './User';

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

  public static async create(subtopicId: number, dto: BaseDto): Promise<number> {
    try {
      const specialty = await Specialty.query().insert({ ...dto });

      await specialty.$relatedQuery('subtopic').relate(subtopicId);

      return specialty.id;
    } catch (error: unknown) {
      throw objectionError(error, 'specialty.create');
    }
  }

  public static async get(id: number): Promise<Specialty> {
    try {
      const specialty = Specialty
        .query()
        .findById(id)
        .withGraphFetched({
          courses: true,
        });

      return specialty;
    } catch (error: unknown) {
      throw objectionError(error, 'specialty.get');
    }
  }

  public static async getAll(): Promise<Specialty[]> {
    try {
      const specialties = Specialty
        .query()
        .withGraphFetched({
          courses: true,
        });

      return specialties;
    } catch (error: unknown) {
      throw objectionError(error, 'specialty.all');
    }
  }

  public static async update(id: number, dto: BaseDto): Promise<boolean> {
    try {
      await Specialty.query().findById(id).patch({ ...dto });

      return true;
    } catch (error: unknown) {
      throw objectionError(error, 'specialty.update');
    }
  }

  public static async delete(id: number): Promise<boolean> {
    try {
      await Specialty.query().deleteById(id);

      return true;
    } catch (error: unknown) {
      throw objectionError(error, 'specialty.delete');
    }
  }
}

// For creating/updating Specialty
// @InputType()
// export class SpecialtyDto extends BaseDto implements Partial<Specialty> {}

// For fetching the Specialty data
// @ArgsType()
// export class SpecialtyArgs extends BaseDataArgs {
//   @Field({ nullable: true })
//   subtopicId?: number;
// }
