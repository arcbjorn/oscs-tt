/* eslint-disable max-classes-per-file */
import { Model } from 'objection';
import {
  ArgsType,
  Field, InputType, ObjectType,
} from 'type-graphql';

@ObjectType({ description: 'User' })
export class User extends Model {
  static tableName = 'users';

  @Field()
  id!: number;

  @Field()
  username!: string;

  @Field()
  name?: string;

  @Field()
  bio?: string;
}

// For creating/updating User
@InputType()
export class UserDto implements Partial<User> {
  @Field()
  username!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  bio?: string;
}

// For fetching the User data
@ArgsType()
export class UserArgs {
  @Field()
  id?: number;
}
