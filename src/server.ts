import { env } from './env'
import { app } from './app'

app
  .listen({
    port: env.PORT || 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
