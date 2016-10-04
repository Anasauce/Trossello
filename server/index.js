import '../../config/environment'
import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import errorHandlers from './error_handlers'
import authRoutes from './auth_routes'
import apiRoutes from './api'

const appRoot = process.env.APP_ROOT
const buildPath = process.env.BUILD_PATH
const server = express()

module.exports = server

server.set('env', process.env.NODE_ENV)
server.set('port', process.env.PORT || '3000')
if (process.env.NODE_ENV !== 'test') server.use(logger('dev'))
server.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_KEY]
}))
server.use(express.static(buildPath+'/public'))
server.use(bodyParser.json({ type: 'application/json' }))

server.use('/',    authRoutes);
server.use('/api', apiRoutes)

if (process.env.NODE_ENV === 'test'){
  // authentication back door
  server.get('/__login/:userId', (request, response) => {
    request.session.userId = Number(request.params.userId)
    response.status(200).send('')
  })
}

server.get('/*', (request, response) => {
  response.sendFile(buildPath+'/public/index.html')
});

server.use(errorHandlers)

if (process.env.NODE_ENV !== 'test'){
  server.listen(server.get('port'))
}
