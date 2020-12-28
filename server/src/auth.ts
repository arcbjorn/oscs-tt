export default class AuthContext {
  constructor(
    readonly id?: number,
    readonly email?: string,
    readonly name?: string,
    readonly language?: number,
  // eslint-disable-next-line no-empty-function
  ) { }

  checkLanguage(language: number, error?: string): boolean {
    const result = !!this.language;

    if (!result && error) throw new Error(error);

    return result;
  }
}
