import {
  Resolver,
  Query,
  Mutation,
  Args,
  Arg,
} from 'type-graphql';

import { User, UserArgs, BaseDto } from '../db';
import { createUserSamples } from '../samples';

@Resolver(User)
export class UserResolver {
  private readonly users: User[] = createUserSamples();

  @Query(() => User, { nullable: true })
  async getUser(@Args() { id }: UserArgs): Promise<User> {
    const entry = await this.users.find((user) => user.id === id);
    if (entry === undefined) {
      throw new Error();
    }
    return entry;
  }

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    const users = await this.users;
    if (users === undefined) {
      throw new Error();
    }
    return users;
  }

  @Mutation(() => [User])
  async createUser(@Arg('dto') dto: BaseDto): Promise<Number> {
    const user = Object.assign(new User(), {
      description: dto.description,
      name: dto.name,
    });
    await this.users.push(user);
    if (user === undefined) {
      throw new Error();
    }
    return user.id;
  }
}
