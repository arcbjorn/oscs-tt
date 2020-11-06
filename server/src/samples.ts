import { TimeEntry, Course, Topic } from './db';

function createTimeEntry(timeEntryData: Partial<TimeEntry>) {
  return Object.assign(new TimeEntry(), timeEntryData);
}

function createCourse(courseData: Partial<Course>) {
  return Object.assign(new Course(), courseData);
}

function createTopic(timeEntryData: Partial<Topic>) {
  return Object.assign(new Topic(), timeEntryData);
}

export function createTimeEntrySamples() {
  return [
    createTimeEntry({
      description: 'Desc 1',
      name: 'TimeEntry 1',
      startDate: new Date('2018-04-11'),
      endDate: new Date('2018-04-11'),
    }),
    createTimeEntry({
      description: 'Desc 2',
      name: 'TimeEntry 2',
      startDate: new Date('2018-04-11'),
      endDate: new Date('2018-04-11'),
    }),
    createTimeEntry({
      description: 'Desc 3',
      name: 'TimeEntry 3',
      startDate: new Date('2018-04-11'),
      endDate: new Date('2018-04-11'),
    }),
  ];
}

export function createCourseSamples() {
  return [
    createCourse({
      name: 'Course 1',
      description: 'Course Desc 1',
    }),
    createCourse({
      name: 'Course 2',
      description: 'Course Desc 2',
    }),
    createCourse({
      name: 'Course 3',
      description: 'Course Desc 3',
    }),
  ];
}

export function createTopicSamples() {
  return [
    createTopic({
      name: 'Topic 1',
      description: 'Topic Desc 1',
    }),
    createTopic({
      name: 'Topic 2',
      description: 'Topic Desc 2',
    }),
    createTopic({
      name: 'Topic 3',
      description: 'Topic Desc 3',
    }),
  ];
}
