import { Model } from 'objection';
import {
  ArgsType,
  Field, InputType, ObjectType,
} from 'type-graphql';
import { AuthenticationError, ValidationError } from 'apollo-server';
import DefaultContext from '../../DefaultContext';
import {
  generateToken, getRefreshToken, removeRefreshToken, setRefreshToken, TokenType, verifyRefreshToken,
} from '../../auth/jwt.helpers';
import { AuthResult } from '../../auth/AuthResult';
import { checkSecret, generateSecret } from '../../auth/bcrypt.helper';
import { Language } from './Language';

// For creating/updating User
@InputType()
export class UserDto implements Partial<User> {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  languageId?: number;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  confirmPassword?: string;
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
  name!: string;

  @Field()
  email!: string;

  @Field()
  language!: Language;

  @Field()
  secret!: string;

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

    if (!user) throw new AuthenticationError('Refresh Token is invalid');

    const match = await user.checkSecret(password);

    if (!match) throw new AuthenticationError('Wrong password');

    const { id, name, language } = user;

    const {
      token: refreshToken, expiresIn: refreshTokenExpiry,
    } = await generateToken({ id }, TokenType.REFRESH);

    const { token: accessToken } = await generateToken({
      id, email, name, languageId: language.id,
    }, TokenType.ACCESS);

    setRefreshToken(res, refreshToken);

    return {
      accessToken,
      refreshTokenExpiry,
    };
  }

  public static async register(userDto: UserDto, res: any): Promise<AuthResult> {
    const {
      name, email, password, confirmPassword, languageId,
    } = userDto;

    if (Object.values(userDto).some((val) => !val)) {
      throw new ValidationError('Missing user info to register');
    }

    const existingUser = await User
      .query()
      .where('email', '=', email!)
      .first();

    if (existingUser) throw new AuthenticationError('This email is already used');
    if (password !== confirmPassword) throw new ValidationError('Confirmed password does not match');

    const secret = await generateSecret(password!, +process.env.AUTH_SALT_ROUNDS!);

    const { id } = await User.query().upsertGraph({
      name,
      email,
      secret,
      language: { id: languageId },
    }, { relate: true });

    const {
      token: refreshToken, expiresIn: refreshTokenExpiry,
    } = await generateToken({ id }, TokenType.REFRESH);

    const { token: accessToken } = await generateToken({
      id, email, name, languageId,
    }, TokenType.ACCESS);

    setRefreshToken(res, refreshToken);

    return {
      accessToken,
      refreshTokenExpiry,
    };
  }

  public static async refresh({ req, res }: DefaultContext): Promise<AuthResult> {
    const currentRefreshToken = getRefreshToken(req);

    const refreshTokenPayload = await verifyRefreshToken(currentRefreshToken);
    if (!refreshTokenPayload) throw new AuthenticationError('Refresh Token is invalid');

    const { id } = refreshTokenPayload;
    const { name, email, language } = await User.query().findById(id).withGraphFetched('language');

    const {
      token: refreshToken, expiresIn: refreshTokenExpiry,
    } = await generateToken({ id }, TokenType.REFRESH);

    const { token: accessToken } = await generateToken({
      id, email, name, languageId: language.id,
    }, TokenType.ACCESS);

    setRefreshToken(res, refreshToken);

    return {
      accessToken,
      refreshTokenExpiry,
    };
  }

  public static async logout(res: any): Promise<boolean> {
    removeRefreshToken(res);
    return true;
  }
}
