import { TimeEntry } from './db';

function createTimeEntry(timeEntryData: Partial<TimeEntry>) {
  return Object.assign(new TimeEntry(), timeEntryData);
}

export function createTimeEntrySamples() {
  return [
    createTimeEntry({
      description: 'Desc 1',
      title: 'TimeEntry 1',
      creationDate: new Date('2018-04-11'),
    }),
    createTimeEntry({
      description: 'Desc 2',
      title: 'TimeEntry 2',
      creationDate: new Date('2018-04-15'),
    }),
    createTimeEntry({
      description: 'Desc 3',
      title: 'TimeEntry 3',
      creationDate: new Date(),
    }),
  ];
}
