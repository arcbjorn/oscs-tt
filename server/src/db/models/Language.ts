import { Model } from 'objection';
import {
  ArgsType, Field, InputType, ObjectType,
} from 'type-graphql';

// For creating/updating Language
@InputType()
export class LanguageDto implements Partial<Language> {
  @Field()
  code?: string;

  @Field()
  name?: string;
}

// For fetching the Language data
@ArgsType()
export class LanguageArgs {
  @Field()
  id?: number;
}

@ObjectType()
export class Language extends Model {
  static tableName = 'languages';

  @Field()
  id!: number;

  @Field()
  code!: string;

  @Field()
  name!: string;

  static jsonSchema = {
    type: 'object',
    required: ['code', 'name'],

    properties: {
      id: { type: 'integer' },
      code: { type: 'string', min: 2, max: 2 },
      name: { type: 'string', min: 1, max: 28 },
    },
  };

  public static get(id: number) {
    return Language.query().findById(id);
  }
}
