import { Model } from 'objection';
import {
  ArgsType,
  Field, InputType, ObjectType,
} from 'type-graphql';
import { generateToken, setRefreshToken, TokenType } from '../../auth/jwt.helpers';
import { AuthResult } from '../../auth/AuthResult';
import { checkSecret } from '../../auth/bcrypt.helper';
import { Language } from './Language';

// For creating/updating User
@InputType()
export class UserDto implements Partial<User> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  bio?: string;
}

// For fetching the User data
@ArgsType()
export class UserArgs {
  @Field()
  id?: number;
}

@ObjectType({ description: 'OSCSTT User' })
export class User extends Model {
  static tableName = 'users';

  @Field()
  id!: number;

  @Field()
  secret!: string;

  @Field()
  name!: string;

  @Field()
  language!: Language;

  @Field()
  bio?: string;

  static relationMappings = () => ({
    language: {
      relation: Model.BelongsToOneRelation,
      modelClass: Language,
      join: {
        from: 'users.languageId',
        to: 'languages.id',
      },
    },
  });

  public checkSecret(password: string) {
    return checkSecret(password, this.secret);
  }

  public static async login(email: string, password: string, res: any): Promise<AuthResult> {
    const user = await User
      .query()
      .where('email', '=', email)
      .first()
      .withGraphFetched('language');

    if (!user) {
      return {
        accessToken: '',
        refreshTokenExpiry: 0,
        error: 'User not found!',
      };
    }

    const match = await user.checkSecret(password);
    if (!match) {
      return {
        accessToken: '',
        refreshTokenExpiry: 0,
        error: 'Wrong password!',
      };
    }
    const { id, name, language } = user;
    const {
      token: refreshToken, expiresIn: refreshTokenExpiry,
    } = await generateToken({ id }, TokenType.REFRESH);

    const { token: accessToken } = await generateToken({
      id, email, name, language: language.id,
    }, TokenType.ACCESS);

    setRefreshToken(res, refreshToken);
    return {
      accessToken,
      refreshTokenExpiry,
    };
  }
}
