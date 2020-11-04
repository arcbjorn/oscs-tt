export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  timeEntry?: Maybe<TimeEntry>;
  /** Get all the TimeEntries */
  timeEntries: Array<TimeEntry>;
};


export type QueryTimeEntryArgs = {
  id: Scalars['Float'];
  title?: Maybe<Scalars['String']>;
};

/** Object representing time entry */
export type TimeEntry = {
  __typename?: 'TimeEntry';
  title: Scalars['String'];
  /** The time entry description */
  description: Scalars['String'];
  creationDate: Scalars['DateTime'];
};


export type Mutation = {
  __typename?: 'Mutation';
  addTimeEntry: Array<TimeEntry>;
};


export type MutationAddTimeEntryArgs = {
  dto: TimeEntryDto;
};

export type TimeEntryDto = {
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};
