import {
  Resolver,
  Query,
  Mutation,
  Args,
  Arg,
} from 'type-graphql';

import { BaseDto, Subtopic, SubtopicArgs } from '../db';

@Resolver(Subtopic)
export class SubtopicResolver {
  private readonly subtopicList: Subtopic[] = [];

  @Query(() => Subtopic, { nullable: true })
  async subtopic(@Args() { id }: SubtopicArgs): Promise<Subtopic> {
    const entry = await this.subtopicList.find((subtopic) => subtopic.id === id);
    if (entry === undefined) {
      throw new Error();
    }
    return entry;
  }

  @Query(() => [Subtopic])
  async subtopics(): Promise<Subtopic[]> {
    const subtopicList = await this.subtopicList;
    if (subtopicList === undefined) {
      throw new Error();
    }
    return subtopicList;
  }

  @Mutation(() => [Subtopic])
  async createSubtopic(@Arg('dto') dto: BaseDto): Promise<number> {
    const subtopic = Object.assign(new Subtopic(), {
      description: dto.description,
      name: dto.name,
    });
    await this.subtopicList.push(subtopic);
    if (subtopic === undefined) {
      throw new Error();
    }
    return subtopic.id;
  }
}
