import { verifyAccessToken } from './jwt.helpers';

export default class AuthContext {
  constructor(
    readonly id?: number,
    readonly email?: string,
    readonly name?: string,
    readonly language?: number,
  // eslint-disable-next-line no-empty-function
  ) { }

  public static async create(req: any): Promise<AuthContext> {
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

  checkLanguage(language: number, error?: string): boolean {
    const result = this.language === language;

    if (!result && error) throw new Error(error);

    return result;
  }
}
