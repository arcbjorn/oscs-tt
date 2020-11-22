/* eslint-disable no-empty-function */
export class AuthCtx {
  constructor(
    readonly id: number,
    readonly email?: string,
    readonly name?: string,
    readonly language?: number,
  ) { }
}
