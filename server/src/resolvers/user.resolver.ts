/* eslint-disable class-methods-use-this */

import {
  Resolver,
  Query,
  Mutation,
  Args,
  Arg,
  Ctx,
} from 'type-graphql';
import DefaultContext from '../DefaultContext';
import { AuthResult } from '../auth/AuthResult';

import { User, UserArgs, UserDto } from '../db';
import { createUserSamples } from '../samples';

@Resolver(User)
export class UserResolver {
  private readonly users: User[] = createUserSamples();

  @Mutation(() => AuthResult)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() context: DefaultContext,
  ): Promise<AuthResult> {
    const result = await User.login(email, password, context.res);
    return result;
  }

  @Mutation(() => AuthResult)
  async register(
    @Arg('userDto') userDto: UserDto,
    @Ctx() context: DefaultContext,
  ): Promise<AuthResult> {
    const result = await User.register({ ...userDto }, context.res);
    return result;
  }

  @Mutation(() => AuthResult)
  async refreshAccessToken(
    @Ctx() context: DefaultContext,
  ): Promise<AuthResult> {
    const result = await User.refresh(context);
    return result;
  }

  @Mutation(() => Boolean)
  async logout(
    @Ctx() context: DefaultContext,
  ): Promise<Boolean> {
    const result = await User.logout(context);
    return result;
  }

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

  @Mutation(() => Number)
  async createUser(@Arg('dto') dto: UserDto): Promise<Number> {
    const user = Object.assign(new User(), {
      email: dto.email,
      name: dto.name,
    });
    await this.users.push(user);
    if (user === undefined) {
      throw new Error();
    }
    return user.id;
  }
}
