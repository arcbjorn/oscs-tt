import { Model } from 'objection';
import { ValidationError } from 'apollo-server';
import {
  ArgsType, Field, InputType, ObjectType,
} from 'type-graphql';
import { objectionError } from '../utils/error.handler';

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

  public static async create(dto: LanguageDto): Promise<number> {
    try {
      if (Object.values(dto).some((val) => !val)) {
        throw new ValidationError('Missing language info for creation');
      }

      const { id } = await Language.query().insert({ ...dto });

      return id;
    } catch (error: unknown) {
      throw objectionError(error, 'language.create');
    }
  }

  public static get(id: number) {
    return Language.query().findById(id);
  }
}
