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
  async getTopic(@Args() { title }: TopicArgs) {
    const entry = await this.topics.find((topic) => topic.title === title);
    if (entry === undefined) {
      throw new Error();
    }
    return entry;
  }

  @Query(() => [Topic])
  async getTopics() {
    const topics = await this.topics;
    if (topics === undefined) {
      throw new Error();
    }
    return topics;
  }

  @Mutation(() => [Topic])
  async addTopic(@Arg('dto') dto: TopicDto) {
    const topic = Object.assign(new Topic(), {
      description: dto.description,
      title: dto.title,
    });
    await this.topics.push(topic);
    if (topic === undefined) {
      throw new Error();
    }
    return topic;
  }
}
