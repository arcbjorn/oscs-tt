import {
  ValidationError,
  NotFoundError,
  DBError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  CheckViolationError,
  DataError,
} from 'objection';

export function objectionError(error: any, i18nCode: string) {
  switch (true) {
    case (error instanceof ValidationError):
      return new ValidationError({
        statusCode: error.statusCode,
        message: i18nCode,
        data: error.data,
        type: error.type,
      });
    case (error instanceof NotFoundError):
      return new ValidationError({
        statusCode: error.statusCode,
        message: i18nCode,
        data: error.data,
        type: error.type,
      });
    case (error instanceof UniqueViolationError):
      return new ValidationError({
        statusCode: 409,
        message: i18nCode,
        type: 'UniqueViolation',
        data: {
          columns: error.columns,
          table: error.table,
          constraint: error.constraint,
        },
      });
    case (error instanceof NotNullViolationError):
      return new ValidationError({
        statusCode: 400,
        message: i18nCode,
        type: 'NotNullViolation',
        data: {
          column: error.column,
          table: error.table,
        },
      });
    case (error instanceof ForeignKeyViolationError):
      return new ValidationError({
        statusCode: 409,
        message: error.message,
        type: 'ForeignKeyViolation',
        data: {
          table: error.table,
          constraint: error.constraint,
        },
      });
    case (error instanceof CheckViolationError):
      return new ValidationError({
        statusCode: 400,
        message: error.message,
        type: 'CheckViolation',
        data: {
          table: error.table,
          constraint: error.constraint,
        },
      });
    case (error instanceof DataError):
      return new ValidationError({
        statusCode: 400,
        message: error.message,
        type: 'InvalidData',
        data: {},
      });
    case (error instanceof DBError):
      return new ValidationError({
        statusCode: 500,
        message: error.message,
        type: 'UnknownDatabaseError',
        data: {},
      });
    default:
      return new ValidationError({
        statusCode: 500,
        message: error.message,
        type: 'UnknownError',
        data: {},
      });
  }
}
