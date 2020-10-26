import {
  Resolver,
  Query,
  Mutation,
  Args,
  Arg,
} from 'type-graphql';

import { TimeEntry, TimeEntriesArgs, TimeEntryDto } from '../db';
import { createTimeEntrySamples } from '../time-entry.samples';

@Resolver(TimeEntry)
export class TimeEntryResolver {
  private readonly items: TimeEntry[] = createTimeEntrySamples();

  // @Query({ nullable: true })
  // async timeEntry(@Args() { title }: TimeEntriesArgs): Promise<TimeEntry> {
  //   const entry = await this.items.find((timeEntry) => timeEntry.title === title);
  //   if (entry === undefined) {
  //     throw new Error();
  //   }
  //   return entry as TimeEntry;
  // }

  // @Query({ description: 'Get all the TimeEntries' })
  // async timeEntries() {
  //   const items = await this.items;
  //   return items;
  // }

  // @Mutation()
  // async addTimeEntry(@Arg('dto') dto: TimeEntryDto) {
  //   const timeEntry = Object.assign(new TimeEntry(), {
  //     description: dto.description,
  //     title: dto.title,
  //     creationDate: new Date(),
  //   });
  //   await this.items.push(timeEntry);
  //   return timeEntry as TimeEntry;
  // }

  // @FieldResolver()
  // ratingsCount(
  //   @Root() recipe: Recipe,
  //   @Arg('minRate', (type) => Int, { defaultValue: 0.0 }) minRate: number,
  // ): number {
  //   return recipe.ratings.filter((rating) => rating >= minRate).length;
  // }
}
