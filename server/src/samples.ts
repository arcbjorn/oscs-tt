import { TimeEntry, Topic } from './db';

function createTimeEntry(timeEntryData: Partial<TimeEntry>) {
  return Object.assign(new TimeEntry(), timeEntryData);
}

function createTopic(timeEntryData: Partial<Topic>) {
  return Object.assign(new Topic(), timeEntryData);
}

export function createTimeEntrySamples() {
  return [
    createTimeEntry({
      description: 'Desc 1',
      title: 'TimeEntry 1',
      startDate: new Date('2018-04-11'),
      endDate: new Date('2018-04-11'),
    }),
    createTimeEntry({
      description: 'Desc 2',
      title: 'TimeEntry 2',
      startDate: new Date('2018-04-11'),
      endDate: new Date('2018-04-11'),
    }),
    createTimeEntry({
      description: 'Desc 3',
      title: 'TimeEntry 3',
      startDate: new Date('2018-04-11'),
      endDate: new Date('2018-04-11'),
    }),
  ];
}

export function createTopicSamples() {
  return [
    createTopic({
      title: 'Topic 1',
      description: 'Topic Desc 1',
    }),
    createTopic({
      title: 'Topic 2',
      description: 'Topic Desc 2',
    }),
    createTopic({
      title: 'Topic 3',
      description: 'Topic Desc 3',
    }),
  ];
}
