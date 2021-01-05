import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Result of an authorisation operation' })
export class AuthResult {
  constructor(init?:Partial<AuthResult>) {
    Object.assign(this, init);
  }

  @Field({ description: 'JWT token for authentification' })
  accessToken!: string;

  @Field({ description: 'Expiration time of the refresh token' })
  refreshTokenExpiry!: number;

  @Field({ nullable: true, description: 'Error message' })
  error?: String;
}
