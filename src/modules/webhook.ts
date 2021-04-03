import express, { Express } from 'express'
import { v4 as publicIpv4 } from 'public-ip'
import { CharlotteGenericError } from '../errors'
import helmet from 'helmet'
import Events from '../events'

export type EventsNames = 'vote'

export default class extends Events {
  private readonly _app: Express
  private readonly _port: number
  private readonly _endpoint: string
  private readonly _auth?: string
  constructor (port: number = 8080, endpoint: string = 'webhook', auth?: string) {
    super()
    this._app = express()
    this._port = port
    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint
    }
    this._endpoint = endpoint
    this._auth = auth
  }

  on (type: EventsNames, callback: (data: any) => void): void {
    super.on(type, callback)
  }

  emit (type: EventsNames, data: any): void {
    super.emit(type, data)
  }

  start (): void {
    this._app.use(helmet())
    this._app.use(express.json())

    this._app.post(this._endpoint, (req, res) => {
      if (this._auth !== undefined) {
        if (req.headers.authorization !== this._auth) {
          throw new CharlotteGenericError('webhookUnauthorized', `Provided token: ${req.headers.authorization ?? ''}`)
        }
      }

      this.emit('vote', req.body)

      res.sendStatus(200)
    })

    this._app.listen(this._port, () => {
      publicIpv4()
        .then(ip => {
          console.log(`[Charlotte] Listen webhook on: http://${ip}:${this._port}${this._endpoint}`)
        })
        .catch(err => {
          throw new CharlotteGenericError('unknown', err)
        })
    })
  }
}
