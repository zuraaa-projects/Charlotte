import express, { Express } from 'express'
import { v4 as publicIpv4 } from 'public-ip'
import { CharlotteGenericError } from '../errors'
import helmet from 'helmet'
import { EventEmitter } from 'events'
import { IWebhook } from '../types'

export type EventsNames = 'vote'

export interface WebHookConfig {
  port?: number | null
  endpoint?: string | null
  auth?: string | null
  customExpress?: Express | null
}

export default class extends EventEmitter {
  private readonly _app: Express
  private readonly _port: number
  private readonly _endpoint: string
  private readonly _auth?: string | null
  constructor (config?: WebHookConfig) {
    super()
    if (config == null) {
      config = {}
    }
    if (config.customExpress == null) {
      this._app = express()
      this._app.use(helmet())
      this._app.use(express.json())
    } else {
      this._app = config.customExpress
    }

    if (config.port == null) {
      this._port = 8080
    } else {
      this._port = config.port
    }

    if (config.endpoint == null) {
      this._endpoint = 'webhook'
    } else {
      this._endpoint = config.endpoint
    }
    if (!this._endpoint.startsWith('/')) {
      this._endpoint = '/' + this._endpoint
    }
    this._auth = config.auth
  }

  on (type: EventsNames, callback: (data: IWebhook) => void): this {
    return super.on(type, callback)
  }

  emit (type: EventsNames, data: IWebhook): boolean {
    return super.emit(type, data)
  }

  start (): void {
    this._app.post(this._endpoint, (req, res) => {
      if (this._auth != null) {
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
