export default class {
  private readonly _events: IEvent[]
  constructor () {
    this._events = []
  }

  on (type: string, callback: any): void {
    this._events.push({
      callback,
      name: type
    })
  }

  off (type: string, callback: any): void {
    let index
    do {
      index = this._events.findIndex(x => x.name === type && x.callback === callback)
      if (index !== -1) {
        this._events.splice(index, 1)
      } else {
        return
      }
    } while (true)
  }

  emit (type: string, data: any): void {
    const events = this._events.filter(x => x.name === type)
    for (const event of events) {
      event.callback(data)
    }
  }
}

export interface IEvent {
  name: string
  callback: (data: any) => void
}
