import { Model } from 'objection';
import {
  Field, ObjectType,
} from 'type-graphql';
import { objectionError } from '../utils/error.handler';
import { BaseDto, BaseModel } from './Base';
import { Course } from './Course';
import { Specialty } from './Specialty';
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
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'subtopics.ownerId',
        to: 'users.id',
      },
    },
  });

  public static async create(topicId: number, dto: BaseDto): Promise<number> {
    try {
      const subtopic = await Subtopic.query().insert({ ...dto });

      await subtopic.$relatedQuery('topic').relate(topicId);

      return subtopic.id;
    } catch (error: unknown) {
      throw objectionError(error, 'subtopic.create');
    }
  }

  public static async get(id: number): Promise<Subtopic> {
    try {
      const subtopic = Subtopic
        .query()
        .findById(id)
        .withGraphFetched({
          specialties: true,
          courses: true,
        });

      return subtopic;
    } catch (error: unknown) {
      throw objectionError(error, 'subtopic.get');
    }
  }

  public static async getAll(): Promise<Subtopic[]> {
    try {
      const subtopics = Subtopic
        .query()
        .withGraphFetched({
          specialties: true,
          courses: true,
        });

      return subtopics;
    } catch (error: unknown) {
      throw objectionError(error, 'subtopic.all');
    }
  }

  public static async update(id: number, dto: BaseDto): Promise<boolean> {
    try {
      await Subtopic.query().findById(id).patch({ ...dto });

      return true;
    } catch (error: unknown) {
      throw objectionError(error, 'subtopic.update');
    }
  }

  public static async delete(id: number): Promise<boolean> {
    try {
      await Subtopic.query().deleteById(id);

      return true;
    } catch (error: unknown) {
      throw objectionError(error, 'subtopic.delete');
    }
  }
}

// For creating/updating Subtopic
// @InputType()
// export class SubtopicDto extends BaseDto implements Partial<Subtopic> {}

// For fetching the Subtopic data
// @ArgsType()
// export class SubtopicArgs extends BaseDataArgs {}
