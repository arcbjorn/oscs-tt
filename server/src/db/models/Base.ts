// eslint-disable-next-line max-classes-per-file
import { Model } from 'objection';
import {
  ArgsType, Field, InputType, ObjectType,
} from 'type-graphql';
import { User } from './User';

@ObjectType()
export class BaseModel extends Model {
  @Field()
  id!: number;

  @Field()
  name!: string;

  @Field(() => User, { description: 'Owner' })
  owner!: User;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class BaseDto {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  ownerId?: number;
}

@ArgsType()
export class BaseDataArgs {
  @Field()
  id?: number;

  @Field({ nullable: true })
  authCtxId!: number;
}
