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
  private readonly courses: Course[] = createCourseSamples();

  @Query(() => Course, { nullable: true })
  async getCourse(@Args() { id }: CourseArgs) {
    const entry = await this.courses.find((course) => course.id === id);
    if (entry === undefined) {
      throw new Error();
    }
    return entry;
  }

  @Query(() => [Course])
  async getCourses() {
    const courses = await this.courses;
    if (courses === undefined) {
      throw new Error();
    }
    return courses;
  }

  @Mutation(() => [Course])
  async createCourse(@Arg('dto') dto: CourseDto) {
    const course = Object.assign(new Course(), {
      description: dto.description,
      name: dto.name,
    });
    await this.courses.push(course);
    if (course === undefined) {
      throw new Error();
    }
    return course;
  }
}
