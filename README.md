# Charlotte
Charlotte é um Wrapper para Javascript/Typescript criado para facilitar o uso da API do [Zuraaa List](https://www.zuraaa.com).

Contendo as principais funcionalidades como pegar informações dos ‘bots’ e usuários diretamente da API, bem como um mini servidor de WebHook para receber votos em tempo real.

## Estilo de código

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

## Instalação
```sh
$ npm i --save @zuraaa-projects/charlotte
```
## Exemplo de utilização: 
 - Rest:
```js
const { ZuraaaRestApi } = require('@zuraaa-projects/charlotte')

const apiRest = new ZuraaaRestApi()

apiRest.getBot('id do bot')
  .then(console.log)
  .catch(console.err)

apiRest.getUser('id do usuario')
  .then(console.log)
  .catch(console.err)
```

 - WebSocket
 ```js
 const { ZuraaaWebHook } = require('@zuraaa-projects/charlotte')

 //criar webhook com as configurações default
 const webhook = new ZuraaaWebHook()

 //criar webhook com configuração personalizada
 const webhook = new ZuraaaWebHook({
   port: 5000,
   endpoint: 'webhook/callback',
   auth: 'imagine um hash daora aqui ou um password'
 })

  webhook.on('vote', dataVote => {
    //ação que deseja tomar quando o bot receber um voto
  })

  webhook.start()
 ```
### Suporte

- Suporte feito através do nosso [Discord](https://discord.gg/EShHzNtVAb)

### Fair Use

- Fica livre o uso desse software bem como modificações no mesmo desde que dentro da licença MIT.
