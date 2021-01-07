export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  getUser?: Maybe<User>;
  getUsers: Array<User>;
  timeEntry?: Maybe<TimeEntry>;
  timeEntries: Array<TimeEntry>;
  getCourse?: Maybe<Course>;
  getCourses: Array<Course>;
  getSpecialty?: Maybe<Specialty>;
  getSpecialtys: Array<Specialty>;
  getSubtopic?: Maybe<Subtopic>;
  getSubtopics: Array<Subtopic>;
  getTopic?: Maybe<Topic>;
  getTopics: Array<Topic>;
};


export type QueryGetUserArgs = {
  id: Scalars['Float'];
};


export type QueryTimeEntryArgs = {
  id: Scalars['Float'];
  authCtxId?: Maybe<Scalars['Float']>;
  sourceId: Scalars['Float'];
};


export type QueryGetCourseArgs = {
  id: Scalars['Float'];
  authCtxId?: Maybe<Scalars['Float']>;
  sourceId?: Maybe<Scalars['Float']>;
};


export type QueryGetSpecialtyArgs = {
  id: Scalars['Float'];
  authCtxId?: Maybe<Scalars['Float']>;
  subtopicId?: Maybe<Scalars['Float']>;
};


export type QueryGetSubtopicArgs = {
  id: Scalars['Float'];
  authCtxId?: Maybe<Scalars['Float']>;
  topicId?: Maybe<Scalars['Float']>;
};


export type QueryGetTopicArgs = {
  id: Scalars['Float'];
  authCtxId?: Maybe<Scalars['Float']>;
};

/** OSCSTT User */
export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  name: Scalars['String'];
  email: Scalars['String'];
  language: Language;
  secret: Scalars['String'];
};

export type Language = {
  __typename?: 'Language';
  id: Scalars['Float'];
  code: Scalars['String'];
  name: Scalars['String'];
};

/** Time entry of the user */
export type TimeEntry = {
  __typename?: 'TimeEntry';
  id: Scalars['Float'];
  name: Scalars['String'];
  /** Owner */
  owner: User;
  description?: Maybe<Scalars['String']>;
  source: TimeEntrySource;
  /** Specific area of academic Sub-topic */
  specialty: Specialty;
  /** Optional educational Course */
  course: Course;
  /** Optional educational Course Section */
  section: Section;
  startDate: Scalars['DateTime'];
  endDate: Scalars['DateTime'];
};

export enum TimeEntrySource {
  Specialty = 'SPECIALTY',
  Course = 'COURSE',
  Section = 'SECTION'
}

/** Academic Specialty */
export type Specialty = {
  __typename?: 'Specialty';
  id: Scalars['Float'];
  name: Scalars['String'];
  /** Owner */
  owner: User;
  description?: Maybe<Scalars['String']>;
  /** Part of academic Topic */
  subtopic: Subtopic;
  /** Periods of time spent on this Specialty */
  timeEntries: TimeEntry;
};

/** Academic Sub-topic */
export type Subtopic = {
  __typename?: 'Subtopic';
  id: Scalars['Float'];
  name: Scalars['String'];
  /** Owner */
  owner: User;
  description?: Maybe<Scalars['String']>;
  /** One of the main fields of knowledge */
  topic: Topic;
  /** Specialties */
  specialties: Array<Specialty>;
  /** Courses without specialty */
  courses: Array<Course>;
  /** Time spent on Subtopic */
  timeEntries?: Maybe<TimeEntry>;
};

/** Academic Topic */
export type Topic = {
  __typename?: 'Topic';
  id: Scalars['Float'];
  name: Scalars['String'];
  /** Owner */
  owner: User;
  description?: Maybe<Scalars['String']>;
  /** Components */
  subtopics: Subtopic;
};

/** Educational Course */
export type Course = {
  __typename?: 'Course';
  id: Scalars['Float'];
  name: Scalars['String'];
  /** Owner */
  owner: User;
  description?: Maybe<Scalars['String']>;
  /** Instructor of Course */
  instructor: Scalars['String'];
  /** Course code */
  code: Scalars['String'];
  /** Institution, providing Course */
  institution: Scalars['String'];
  /** Spcialty or Subtopic */
  source: CourseSource;
  /** Subtopic, which contains Course */
  subtopic: Subtopic;
  /** Specialty, which contains Course */
  specialty: Specialty;
  /** Parts of Course */
  sections?: Maybe<Section>;
  /** Time spent on Course */
  timeEntries?: Maybe<TimeEntry>;
};

export enum CourseSource {
  Subtopic = 'SUBTOPIC',
  Specialty = 'SPECIALTY'
}

/** Part of Course */
export type Section = {
  __typename?: 'Section';
  id: Scalars['Float'];
  name: Scalars['String'];
  /** Owner */
  owner: User;
  description?: Maybe<Scalars['String']>;
  /** Course, which contains Section */
  course: Course;
  /** Time spent on Section of Course */
  timeEntries?: Maybe<TimeEntry>;
};


export type Mutation = {
  __typename?: 'Mutation';
  createLanguage: Scalars['Float'];
  login: AuthResult;
  register: AuthResult;
  refreshAccessToken: AuthResult;
  logout: Scalars['Boolean'];
  createUser: Scalars['Float'];
  createTimeEntry: Array<TimeEntry>;
  createCourse: Array<Course>;
  createSpecialty: Specialty;
  createSubtopic: Array<Subtopic>;
  createTopic: Array<Topic>;
};


export type MutationCreateLanguageArgs = {
  dto: LanguageDto;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  userDto: UserDto;
};


export type MutationCreateUserArgs = {
  dto: UserDto;
};


export type MutationCreateTimeEntryArgs = {
  dto: TimeEntryDto;
};


export type MutationCreateCourseArgs = {
  dto: CourseDto;
};


export type MutationCreateSpecialtyArgs = {
  dto: BaseDto;
};


export type MutationCreateSubtopicArgs = {
  dto: BaseDto;
};


export type MutationCreateTopicArgs = {
  dto: BaseDto;
};

export type LanguageDto = {
  code: Scalars['String'];
  name: Scalars['String'];
};

/** Result of an authorisation operation */
export type AuthResult = {
  __typename?: 'AuthResult';
  /** JWT token for authentification */
  accessToken: Scalars['String'];
  /** Expiration time of the refresh token */
  refreshTokenExpiry: Scalars['Float'];
  /** Error message */
  error?: Maybe<Scalars['String']>;
};

export type UserDto = {
  id?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  languageId?: Maybe<Scalars['Float']>;
  password?: Maybe<Scalars['String']>;
  confirmPassword?: Maybe<Scalars['String']>;
};

export type TimeEntryDto = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  ownerId?: Maybe<Scalars['Float']>;
  source: Scalars['Float'];
};

export type CourseDto = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  ownerId?: Maybe<Scalars['Float']>;
  instructor?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  institution?: Maybe<Scalars['String']>;
  source: Scalars['Float'];
};

export type BaseDto = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  ownerId?: Maybe<Scalars['Float']>;
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'AuthResult' }
    & Pick<AuthResult, 'accessToken' | 'refreshTokenExpiry' | 'error'>
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RefreshAccessTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshAccessTokenMutation = (
  { __typename?: 'Mutation' }
  & { refreshAccessToken: (
    { __typename?: 'AuthResult' }
    & Pick<AuthResult, 'accessToken' | 'refreshTokenExpiry' | 'error'>
  ) }
);
