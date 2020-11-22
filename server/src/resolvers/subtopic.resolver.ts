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
  private readonly subtopics: Subtopic[] = [];

  @Query(() => Subtopic, { nullable: true })
  async getSubtopic(@Args() { id }: SubtopicArgs) {
    const entry = await this.subtopics.find((subtopic) => subtopic.id === id);
    if (entry === undefined) {
      throw new Error();
    }
    return entry;
  }

  @Query(() => [Subtopic])
  async getSubtopics() {
    const subtopics = await this.subtopics;
    if (subtopics === undefined) {
      throw new Error();
    }
    return subtopics;
  }

  @Mutation(() => [Subtopic])
  async createSubtopic(@Arg('dto') dto: BaseDto) {
    const subtopic = Object.assign(new Subtopic(), {
      description: dto.description,
      name: dto.name,
    });
    await this.subtopics.push(subtopic);
    if (subtopic === undefined) {
      throw new Error();
    }
    return subtopic;
  }
}
