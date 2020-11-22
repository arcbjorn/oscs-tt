import Knex from 'knex';
import { Model } from 'objection';

import dbconfig from './knexfile';

export * from './models/TimeEntry';
export * from './models/Section';
export * from './models/Course';
export * from './models/Specialty';
export * from './models/Subtopic';
export * from './models/Topic';
export * from './models/Base';

export const knex = Knex(dbconfig.development);

Model.knex(knex);
