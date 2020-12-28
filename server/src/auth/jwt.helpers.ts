import jwt from 'jsonwebtoken';
import { registerEnumType } from 'type-graphql';

// eslint-disable-next-line no-shadow
export enum TokenType {
  ACCESS,
  REFRESH,
}

registerEnumType(TokenType, {
  name: 'TokenType',
});

export interface TokenPayload {
  id: number;
  email?: string;
  name?: string;
  language?: number;
}

export const jwtSign = (
  payload: object,
  secret: string,
  options: jwt.SignOptions,
): Promise<string> => new Promise((resolve, reject) => {
  jwt.sign(payload, secret, options, (err, token) => {
    if (err) reject(err); else resolve(token!);
  });
});

export const jwtVerify = (
  token: string,
  secret: string,
  options: jwt.VerifyOptions,
): Promise<object> => new Promise((resolve, reject) => {
  jwt.verify(token, secret, options, (err, decoded) => {
    if (err) reject(err); else resolve(decoded!);
  });
});

export const verifyAccessToken = async (token: string) => {
  try {
    const payload = await jwtVerify(
      token,
      process.env.AUTH_SECRET!,
      { subject: process.env.AUTH_SUBJECT },
    ) as TokenPayload;
    return payload;
  } catch {
    return null;
  }
};

export const generateToken = async (payload: TokenPayload, tokenType: TokenType) => {
  let timeToLive: number;
  let authSecret: string;

  switch (tokenType) {
    case TokenType.ACCESS:
      timeToLive = +process.env.AUTH_TOKEN_TTL!;
      authSecret = process.env.AUTH_SECRET!;
      break;
    case TokenType.REFRESH:
      timeToLive = +process.env.AUTH_REFRESH_TOKEN_TTL!;
      authSecret = process.env.AUTH_REFRESH_SECRET!;
      break;
    default:
      throw new Error('Token Type is undefined');
  }

  const expiresIn = Math.floor(Date.now() / 1000) + timeToLive;
  const token = await jwtSign(payload, authSecret, {
    expiresIn: timeToLive,
    issuer: process.env.AUTH_ISSUER,
    audience: process.env.AUTH_AUDIENCE,
    subject: process.env.AUTH_REFRESH_SUBJECT,
  });
  return { token, expiresIn };
};

// TODO: Cookie to header jwt

export const setRefreshToken = (res: any, refreshToken: string) => {
  const maxAge = process.env.AUTH_REFRESH_TOKEN_TTL;
  const secure = '';
  res.setHeader(
    'Set-Cookie',
    `${process.env.AUTH_REFRESH_COOKIE_NAME}=${refreshToken}; Max-Age=${maxAge}; HttpOnly; SameSite=Strict${secure}`,
  );
};
