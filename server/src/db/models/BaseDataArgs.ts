import { Field } from 'type-graphql';

export class BaseDataArgs {
  @Field()
  id?: number;

  @Field()
  title?: string;

  @Field({ nullable: true })
  ownerId?: string;
}
