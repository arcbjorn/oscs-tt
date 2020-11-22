import {
  Resolver,
  Query,
  Mutation,
  Args,
  Arg,
} from 'type-graphql';

import { TimeEntry, TimeEntryArgs, TimeEntryDto } from '../db';
import { createTimeEntrySamples } from '../samples';

@Resolver(TimeEntry)
export class TimeEntryResolver {
  private readonly items: TimeEntry[] = createTimeEntrySamples();

  @Query(() => TimeEntry, { nullable: true })
  async timeEntry(@Args() { id }: TimeEntryArgs) {
    const entry = await this.items.find((timeEntry) => timeEntry.id === id);
    if (entry === undefined) {
      throw new Error();
    }
    return entry;
  }

  @Query(() => [TimeEntry])
  async timeEntries() {
    const items = await this.items;
    return items;
  }

  @Mutation(() => [TimeEntry])
  async createTimeEntry(@Arg('dto') dto: TimeEntryDto) {
    const timeEntry = Object.assign(new TimeEntry(), {
      description: dto.description,
      name: dto.name,
      creationDate: new Date(),
    });
    await this.items.push(timeEntry);
    return timeEntry;
  }

  // @FieldResolver()
  // ratingsCount(
  //   @Root() recipe: Recipe,
  //   @Arg('minRate', (type) => Int, { defaultValue: 0.0 }) minRate: number,
  // ): number {
  //   return recipe.ratings.filter((rating) => rating >= minRate).length;
  // }
}
