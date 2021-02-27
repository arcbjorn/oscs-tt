import {
  Resolver,
  Query,
  Mutation,
  Args,
  Arg,
} from 'type-graphql';

import { Topic, TopicArgs, BaseDto } from '../db';
import { createTopicSamples } from '../samples';

@Resolver(Topic)
export class TopicResolver {
  private readonly topicList: Topic[] = createTopicSamples();

  @Query(() => Topic, { nullable: true })
  async topic(@Args() { id }: TopicArgs): Promise<Topic> {
    const entry = await this.topicList.find((topic) => topic.id === id);
    if (entry === undefined) {
      throw new Error();
    }
    return entry;
  }

  @Query(() => [Topic])
  async topics(): Promise<Topic[]> {
    const topicList = await this.topicList;
    if (topicList === undefined) {
      throw new Error();
    }
    return topicList;
  }

  @Mutation(() => [Topic])
  async createTopic(@Arg('dto') dto: BaseDto): Promise<number> {
    const topic = Object.assign(new Topic(), {
      description: dto.description,
      name: dto.name,
    });
    await this.topicList.push(topic);
    if (topic === undefined) {
      throw new Error();
    }
    return topic.id;
  }
}
