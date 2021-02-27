/* eslint-disable class-methods-use-this */
import {
  Resolver,
  Mutation,
  Arg,
} from 'type-graphql';

import { Language, LanguageDto } from '../db';

@Resolver(Language)
export class LanguageResolver {
  @Mutation(() => Number)
  async createLanguage(@Arg('dto') dto: LanguageDto): Promise<number> {
    const { id } = await Language.query().insert({
      name: dto.name,
      code: dto.code,
    });
    return id;
  }
}
