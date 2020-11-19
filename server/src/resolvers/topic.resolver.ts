import {
  Resolver,
  Query,
  Mutation,
  Args,
  Arg,
} from 'type-graphql';

import { Topic, TopicArgs, TopicDto } from '../db';
import { createTopicSamples } from '../samples';

@Resolver(Topic)
export class TopicResolver {
  private readonly topics: Topic[] = createTopicSamples();

  @Query(() => Topic, { nullable: true })
  async getTopic(@Args() { name }: TopicArgs): Promise<Topic> {
    const entry = await this.topics.find((topic) => topic.name === name);
    if (entry === undefined) {
      throw new Error();
    }
    return entry;
  }

  @Query(() => [Topic])
  async getTopics(): Promise<Topic[]> {
    const topics = await this.topics;
    if (topics === undefined) {
      throw new Error();
    }
    return topics;
  }

  @Mutation(() => [Topic])
  async createTopic(@Arg('dto') dto: TopicDto): Promise<Number> {
    const topic = Object.assign(new Topic(), {
      description: dto.description,
      name: dto.name,
    });
    await this.topics.push(topic);
    if (topic === undefined) {
      throw new Error();
    }
    return topic.id;
  }
}
