/* eslint-disable no-shadow */
import { Model } from 'objection';
import {
  Field, InputType, ObjectType,
} from 'type-graphql';
import { objectionError } from '../utils/error.handler';
import { BaseModel, BaseDto } from './Base';
import { Specialty } from './Specialty';
import { Section } from './Section';
import { User } from './User';

export enum CourseSource {
  SUBTOPIC,
  SPECIALTY,
}

@ObjectType({ description: 'Educational Course' })
export class Course extends BaseModel {
  static tableName = 'courses';

  @Field({ description: 'Instructor of Course' })
  instructor?: string;

  @Field({ description: 'Course code' })
  code?: string;

  @Field({ description: 'Institution providing Course' })
  institution?: string;

  @Field(() => Specialty, { description: 'Specific area of academic Sub-topic' })
  specialty?: Specialty;

  @Field(() => CourseSource, { nullable: true, description: 'Spcialty or Subtopic' })
  source?: CourseSource;

  @Field(() => Section, { nullable: true, description: 'Parts of Course' })
  sections?: Section[];

  static relationMappings = () => ({
    timeEntries: {
      relation: Model.HasManyRelation,
      modelClass: Section,
      join: {
        from: 'courses.id',
        to: 'sections.courseId',
      },
    },
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'courses.ownerId',
        to: 'users.id',
      },
    },
  });

  public static async create(sourceId: number, dto: CourseDto): Promise<number> {
    try {
      let source: string;

      const course = await Course.query().insert({ ...dto });

      switch (dto.source) {
        case CourseSource.SPECIALTY:
          source = 'specialty';
          break;
        case CourseSource.SUBTOPIC:
          source = 'subtopic';
          break;
        default:
          source = '';
      }

      await course.$relatedQuery(source).relate(sourceId);

      return course.id;
    } catch (error: unknown) {
      throw objectionError(error, 'course.create');
    }
  }

  public static async get(id: number): Promise<Course> {
    try {
      const course = Course
        .query()
        .findById(id)
        .withGraphFetched({
          sections: true,
        });

      return course;
    } catch (error: unknown) {
      throw objectionError(error, 'course.get');
    }
  }

  public static async getAll(): Promise<Specialty[]> {
    try {
      const courses = Course
        .query()
        .withGraphFetched({
          sections: true,
        });

      return courses;
    } catch (error: unknown) {
      throw objectionError(error, 'course.all');
    }
  }

  public static async update(id: number, dto: CourseDto): Promise<boolean> {
    try {
      await Course.query().findById(id).patch({ ...dto });

      return true;
    } catch (error: unknown) {
      throw objectionError(error, 'course.update');
    }
  }

  public static async delete(id: number): Promise<boolean> {
    try {
      await Course.query().deleteById(id);

      return true;
    } catch (error: unknown) {
      throw objectionError(error, 'course.delete');
    }
  }
}

// For creating/updating Course
@InputType()
export class CourseDto extends BaseDto implements Partial<Course> {
  @Field({ nullable: true })
  instructor?: string;

  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  institution?: string;

  @Field({ nullable: true })
  source?: CourseSource;
}

// For fetching the Course data
// @ArgsType()
// export class CourseArgs extends BaseDataArgs {}
