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
  private readonly specialtyList: Specialty[] = [];

  @Query(() => Specialty, { nullable: true })
  async specialty(@Args() { id }: SpecialtyArgs): Promise<Specialty> {
    const entry = await this.specialtyList.find((specialty) => specialty.id === id);
    if (entry === undefined) {
      throw new Error();
    }
    return entry;
  }

  @Query(() => [Specialty])
  async specialties(): Promise<Specialty[]> {
    const specialtyList = await this.specialtyList;
    if (specialtyList === undefined) {
      throw new Error();
    }
    return specialtyList;
  }

  @Mutation(() => Specialty)
  async createSpecialty(@Arg('dto') dto: BaseDto): Promise<number> {
    const specialty = Object.assign(new Specialty(), {
      description: dto.description,
      name: dto.name,
    });
    await this.specialtyList.push(specialty);
    if (specialty === undefined) {
      throw new Error();
    }
    return specialty.id;
  }
}
