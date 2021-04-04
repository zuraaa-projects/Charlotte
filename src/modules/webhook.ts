import express, { Express } from 'express'
import { v4 as publicIpv4 } from 'public-ip'
import { CharlotteGenericError } from '../errors'
import helmet from 'helmet'
import Events from '../events'
import { IWebhook } from '../types'

export type EventsNames = 'vote'

export interface WebHookConfig {
  port?: number
  endpoint?: string
  auth?: string
  customExpress?: Express
}

export default class extends Events {
  private readonly _app: Express
  private readonly _port: number
  private readonly _endpoint: string
  private readonly _auth?: string
  constructor (config: WebHookConfig) {
    super()
    if (config === undefined) {
      config = {}
    }
    if (config.customExpress === undefined) {
      this._app = express()
      this._app.use(helmet())
      this._app.use(express.json())
    } else {
      this._app = config.customExpress
    }

    if (config.port === undefined) {
      this._port = 8080
    } else {
      this._port = config.port
    }

    if (config.endpoint === undefined) {
      this._endpoint = 'webhook'
    } else {
      this._endpoint = config.endpoint
    }
    if (!this._endpoint.startsWith('/')) {
      this._endpoint = '/' + this._endpoint
    }
    this._auth = config.auth
  }

  on (type: EventsNames, callback: (data: IWebhook) => void): void {
    super.on(type, callback)
  }

  emit (type: EventsNames, data: IWebhook): void {
    super.emit(type, data)
  }

  start (): void {
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
