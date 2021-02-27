import {
  Resolver,
  Query,
  Mutation,
  Args,
  Arg,
} from 'type-graphql';

import { Course, CourseArgs, CourseDto } from '../db';
import { createCourseSamples } from '../samples';

@Resolver(Course)
export class CourseResolver {
  private readonly coursesList: Course[] = createCourseSamples();

  @Query(() => Course, { nullable: true })
  async course(@Args() { id }: CourseArgs): Promise<Course> {
    const entry = await this.coursesList.find((course) => course.id === id);
    if (entry === undefined) {
      throw new Error();
    }
    return entry;
  }

  @Query(() => [Course])
  async courses(): Promise<Course[]> {
    const coursesList = await this.coursesList;
    if (coursesList === undefined) {
      throw new Error();
    }
    return coursesList;
  }

  @Mutation(() => [Course])
  async createCourse(@Arg('dto') dto: CourseDto): Promise<number> {
    const course = Object.assign(new Course(), {
      description: dto.description,
      name: dto.name,
    });
    await this.coursesList.push(course);
    if (course === undefined) {
      throw new Error();
    }
    return course.id;
  }
}
