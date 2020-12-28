import jwt from 'jsonwebtoken';

export interface AccessTokenPayload {
  id: number;
  email: string;
  name: string;
  language?: number;
}

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
    ) as AccessTokenPayload;
    return payload;
  } catch {
    return null;
  }
};
