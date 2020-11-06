import {
  Resolver,
  Query,
  Mutation,
  Args,
  Arg,
} from 'type-graphql';

import { Specialty, SpecialtyArgs, SpecialtyDto } from '../db';

@Resolver(Specialty)
export class SpecialtyResolver {
  private readonly specialtys: Specialty[] = [];

  @Query(() => Specialty, { nullable: true })
  async getSpecialty(@Args() { name }: SpecialtyArgs) {
    const entry = await this.specialtys.find((specialty) => specialty.name === name);
    if (entry === undefined) {
      throw new Error();
    }
    return entry;
  }

  @Query(() => [Specialty])
  async getSpecialtys() {
    const specialtys = await this.specialtys;
    if (specialtys === undefined) {
      throw new Error();
    }
    return specialtys;
  }

  @Mutation(() => [Specialty])
  async createSpecialty(@Arg('dto') dto: SpecialtyDto) {
    const specialty = Object.assign(new Specialty(), {
      description: dto.description,
      name: dto.name,
    });
    await this.specialtys.push(specialty);
    if (specialty === undefined) {
      throw new Error();
    }
    return specialty;
  }
}
