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
  async timeEntry(@Args() { id }: TimeEntryArgs): Promise<TimeEntry> {
    const entry = await this.items.find((timeEntry) => timeEntry.id === id);
    if (entry === undefined) {
      throw new Error();
    }
    return entry;
  }

  @Query(() => [TimeEntry])
  async timeEntries(): Promise<TimeEntry[]> {
    const items = await this.items;
    return items;
  }

  @Mutation(() => [TimeEntry])
  async createTimeEntry(@Arg('dto') dto: TimeEntryDto): Promise<number> {
    const timeEntry = Object.assign(new TimeEntry(), {
      description: dto.description,
      name: dto.name,
      creationDate: new Date(),
    });
    await this.items.push(timeEntry);
    return timeEntry.id;
  }

  // @FieldResolver()
  // ratingsCount(
  //   @Root() recipe: Recipe,
  //   @Arg('minRate', (type) => Int, { defaultValue: 0.0 }) minRate: number,
  // ): number {
  //   return recipe.ratings.filter((rating) => rating >= minRate).length;
  // }
}
