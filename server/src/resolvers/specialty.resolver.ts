import {
  Resolver,
  Query,
  Mutation,
  Args,
  Arg,
} from 'type-graphql';

import {
  Specialty, BaseDto, SpecialtyArgs,
} from '../db';

@Resolver(Specialty)
export class SpecialtyResolver {
  private readonly specialties: Specialty[] = [];

  @Query(() => Specialty, { nullable: true })
  async getSpecialty(@Args() { id }: SpecialtyArgs) {
    const entry = await this.specialties.find((specialty) => specialty.id === id);
    if (entry === undefined) {
      throw new Error();
    }
    return entry;
  }

  @Query(() => [Specialty])
  async getSpecialtys() {
    const specialties = await this.specialties;
    if (specialties === undefined) {
      throw new Error();
    }
    return specialties;
  }

  @Mutation(() => Specialty)
  async createSpecialty(@Arg('dto') dto: BaseDto) {
    const specialty = Object.assign(new Specialty(), {
      description: dto.description,
      name: dto.name,
    });
    await this.specialties.push(specialty);
    if (specialty === undefined) {
      throw new Error();
    }
    return specialty;
  }
}
