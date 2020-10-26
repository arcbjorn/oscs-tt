import Knex from 'knex';
import { Model } from 'objection';

import dbconfig from './knexfile';

export * from './models/TimeEntry';
export const knex = Knex(dbconfig.development);

Model.knex(knex);
