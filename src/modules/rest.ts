import Axios, { AxiosInstance, AxiosError } from 'axios'
import { IBot, IUsers } from '../types'
import { CharlotteGenericError, CharlotteRestError } from '../errors'

export default class {
  private readonly _api: AxiosInstance
  constructor () {
    this._api = Axios.create({
      baseURL: 'https://api.zuraaa.com/'
    })
  }

  async getBot (id: string): Promise<IBot> {
    try {
      const response = await this._api.get('bots/' + id)
      return response.data
    } catch (err) {
      throw this._sendThow(err)
    }
  }

  async getUser (id: string): Promise<IUsers> {
    try {
      const response = await this._api.get('bots/' + id)
      return response.data
    } catch (err) {
      throw this._sendThow(err)
    }
  }

  private _sendThow (err: AxiosError): CharlotteGenericError | CharlotteRestError {
    if (err.response === undefined) {
      return new CharlotteGenericError('responseAxiosNotReceived', `${err.name}: ${err.message}`)
    }
    return new CharlotteRestError(err.response.status, err.response.statusText, JSON.stringify(err.response.data))
  }
}
