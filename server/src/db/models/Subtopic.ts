import { Model } from 'objection';
import {
  ArgsType,
  Field, InputType, ObjectType,
} from 'type-graphql';
import { objectionError } from '../utils/error.handler';
import { BaseDataArgs, BaseDto, BaseModel } from './Base';
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
      modelClass: Subtopic,
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

  public static async get(id: number): Promise<Subtopic> {
    try {
      const topic = Subtopic
        .query()
        .findById(id)
        .withGraphFetched({
          specialties: true,
          courses: true,
        });

      return topic;
    } catch (error: unknown) {
      throw objectionError(error, 'subtopic.get');
    }
  }

  public static async create(topicId: number, dto: SubtopicDto): Promise<number> {
    try {
      const topic = await Subtopic.query().insert({ ...dto });

      await topic.$relatedQuery('topic').relate(topicId);

      return topic.id;
    } catch (error: unknown) {
      throw objectionError(error, 'subtopic.create');
    }
  }

  public static async update(id: number, dto: SubtopicDto): Promise<boolean> {
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
@InputType()
export class SubtopicDto extends BaseDto implements Partial<Subtopic> {
  @Field({ nullable: true })
  topicId?: number;
}

// For fetching the Subtopic data
@ArgsType()
export class SubtopicArgs extends BaseDataArgs {
  @Field({ nullable: true })
  topicId?: number;
}
