import bcrypt from 'bcrypt';

export const generateSecret = (password: string, rounds: number) => bcrypt.hash(password, rounds);

export const checkSecret = (password: string, secret: string) => bcrypt.compare(password, secret);
