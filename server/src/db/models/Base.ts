// eslint-disable-next-line max-classes-per-file
import { Model } from 'objection';
import { Field } from 'type-graphql';
import { User } from './User';

export class BaseModel extends Model {
  @Field()
  title!: string;

  @Field(() => User, { description: 'Owner' })
  owner!: User;

  @Field({ nullable: true })
  description?: string;
}

export class BaseDto {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  ownerId?: number;
}

export class BaseDataArgs {
  @Field()
  id?: number;

  @Field()
  title?: string;

  @Field({ nullable: true })
  ownerId?: number;
}
