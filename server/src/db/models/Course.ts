/* eslint-disable no-shadow */
import { Model, QueryBuilder } from 'objection';
import {
  ArgsType,
  Field, InputType, ObjectType, registerEnumType,
} from 'type-graphql';
import { objectionError } from '../utils/error.handler';
import { BaseModel, BaseDto } from './Base';
import { Specialty } from './Specialty';
import { Section } from './Section';
import { User } from './User';
import { TimeEntry } from './TimeEntry';
import { Subtopic } from './Subtopic';

export enum CourseSource {
  SUBTOPIC,
  SPECIALTY,
}

registerEnumType(CourseSource, {
  name: 'CourseSource',
});

@ObjectType({ description: 'Educational Course' })
export class Course extends BaseModel {
  static tableName = 'courses';

  @Field({ description: 'Instructor of Course' })
  instructor?: string;

  @Field({ description: 'Course code' })
  code?: string;

  @Field({ description: 'Institution, providing Course' })
  institution?: string;

  @Field(() => CourseSource, { description: 'Spcialty or Subtopic' })
  source!: CourseSource;

  @Field(() => Subtopic, { description: 'Subtopic, which contains Course' })
  subtopic?: Subtopic;

  @Field(() => Specialty, { description: 'Specialty, which contains Course' })
  specialty?: Specialty;

  @Field(() => Section, { nullable: true, description: 'Parts of Course' })
  sections?: Section[];

  @Field(() => TimeEntry, { nullable: true, description: 'Time spent on Course' })
  timeEntries?: TimeEntry[];

  static relationMappings = () => ({
    sections: {
      relation: Model.HasManyRelation,
      modelClass: Section,
      join: {
        from: 'courses.id',
        to: 'sections.courseId',
      },
    },
    timeEntries: {
      relation: Model.HasManyRelation,
      modelClass: TimeEntry,
      join: {
        from: 'courses.id',
        to: 'timeEntries.courseId',
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

  static get modifiers() {
    return {
      findOwner(builder: QueryBuilder<Course>, ownerId: number) {
        builder.where('ownerId', '=', ownerId);
      },
    };
  }

  public static async create(dto: CourseDto, args: CourseArgs): Promise<number> {
    try {
      if (typeof args.sourceId === 'undefined') {
        throw new Error('Course source ID is missing.');
      }

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

      await course.$relatedQuery(source).relate(args.sourceId);

      await course.$relatedQuery('owner').relate(args.authCtxId);

      return course.id;
    } catch (error: unknown) {
      throw objectionError(error, 'course.create');
    }
  }

  public static async get(id: number, args: CourseArgs): Promise<Course> {
    try {
      if (typeof args.id === 'undefined') {
        throw new Error('Course ID is missing.');
      }

      const course = await Course
        .query()
        .modify('findOwner', args.authCtxId)
        .findById(args.id)
        .withGraphFetched({
          sections: {
            notes: true,
          },
        });

      return course;
    } catch (error: unknown) {
      throw objectionError(error, 'course.get');
    }
  }

  public static async getAll(args: CourseArgs): Promise<Specialty[]> {
    try {
      if (typeof args.id === 'undefined') {
        throw new Error('Course ID is missing.');
      }

      const courses = await Course
        .query()
        .modify('findOwner', args.authCtxId)
        .withGraphFetched({
          sections: true,
        });

      return courses;
    } catch (error: unknown) {
      throw objectionError(error, 'course.all');
    }
  }

  public static async update(dto: CourseDto, args: CourseArgs): Promise<boolean> {
    try {
      if (typeof args.id === 'undefined') {
        throw new Error('Course ID is missing.');
      }

      await Course
        .query()
        .modify('findOwner', args.authCtxId)
        .findById(args.id)
        .patch({ ...dto });

      return true;
    } catch (error: unknown) {
      throw objectionError(error, 'course.update');
    }
  }

  public static async delete(id: number, args: CourseArgs): Promise<boolean> {
    try {
      if (typeof args.id === 'undefined') {
        throw new Error('Course ID is missing.');
      }

      await Course
        .query()
        .modify('findOwner', args.authCtxId)
        .deleteById(id);

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

  @Field({ nullable: false })
  source!: CourseSource;
}

// For fetching the Course data
@ArgsType()
export class CourseArgs {
  @Field()
  id?: number;

  // TODO: Auth Context
  @Field({ nullable: true })
  authCtxId!: number;

  @Field({ nullable: true })
  sourceId?: number;
}
