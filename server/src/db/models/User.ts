import { Model } from 'objection';
import {
  ArgsType,
  Field, InputType, ObjectType,
} from 'type-graphql';
import { verifyAccessToken } from '../../utils/jwt.helpers';
import AuthContext from '../../auth';

@ObjectType({ description: 'User' })
export class User extends Model {
  static tableName = 'users';

  @Field()
  id!: number;

  @Field()
  username!: string;

  @Field()
  name?: string;

  @Field()
  bio?: string;

  @Field()
  secret?: string;

  public static async createAuthContext(req: any): Promise<AuthContext> {
    // Extract the auth header from the HTTP request
    let authentication = req.headers[process.env.AUTH_HEADER_NAME!];
    if (typeof authentication !== 'string') { authentication = ''; }

    // and extract the JWT token from the header value
    const authToken = authentication
      ? authentication.startsWith(process.env.AUTH_HEADER_PREFIX)
      && authentication.substr(process.env.AUTH_HEADER_PREFIX!.length + 1)
      : null;

    // Validate the JWT token and extract the user data
    const auth = await verifyAccessToken(authToken);

    return new AuthContext(auth?.id, auth?.email, auth?.name, auth?.language);
  }
}

// For creating/updating User
@InputType()
export class UserDto implements Partial<User> {
  @Field()
  username!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  bio?: string;
}

// For fetching the Specialty data
@ArgsType()
export class UserArgs {
  @Field()
  id?: number;

  @Field({ nullable: true })
  authCtxId!: number;
}
