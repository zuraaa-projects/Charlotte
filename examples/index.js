const { ZuraaaWebHook } = require('../dist')

const web = new ZuraaaWebHook({
  auth: '123'
})
web.start()

web.on('vote', console.log)
