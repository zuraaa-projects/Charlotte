export type GenericErrorType = 'responseAxiosNotReceived' | 'unknown'

export class CharlotteRestError extends Error {
  readonly code: number
  readonly statusText: string
  readonly data?: string

  constructor (code: number, statusText: string, data?: string) {
    super(`${statusText} (${code}): ${data ?? ''}`)
    this.code = code
    this.statusText = statusText
    this.data = data
  }
}

export class CharlotteGenericError extends Error {
  readonly type: GenericErrorType
  readonly error?: string
  constructor (type: GenericErrorType, error?: string) {
    super(`${type}: ${error ?? ''}`)
    this.error = error
    this.type = type
  }
}
