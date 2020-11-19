// eslint-disable-next-line max-classes-per-file
import { Model } from 'objection';
import { Field, ObjectType } from 'type-graphql';
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

export class BaseDto {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  ownerId?: number;
}

export class BaseDataArgs {
  @Field()
  id?: number;

  @Field()
  name?: string;

  @Field({ nullable: true })
  ownerId?: number;
}
