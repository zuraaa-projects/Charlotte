import express, { Express } from 'express'
import { v4 as publicIpv4 } from 'public-ip'
import { CharlotteGenericError } from '../errors'
import helmet from 'helmet'
import Events from '../events'

export type EventsNames = 'vote'

export interface WebHookConfig {
  port?: number
  endpoint?: string
  auth?: string
}

export default class extends Events {
  private readonly _app: Express
  private readonly _port: number
  private readonly _endpoint: string
  private readonly _auth?: string
  constructor ({ port, endpoint, auth }: WebHookConfig) {
    super()
    this._app = express()
    if (port === undefined) {
      this._port = 8080
    } else {
      this._port = port
    }

    if (endpoint === undefined) {
      this._endpoint = 'webhook'
    } else {
      this._endpoint = endpoint
    }
    if (!this._endpoint.startsWith('/')) {
      this._endpoint = '/' + this._endpoint
    }
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
          res.sendStatus(401)
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
