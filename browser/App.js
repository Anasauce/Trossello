import React from 'react'
import { Router, browserHistory } from 'react-router'
import routes from './routes'
import { Provider } from 'react-redux'
import store from './store'
import actions from './actions'

actions.loadSession()

window.DEBUG = {}
window.DEBUG.store = store
window.DEBUG.actions = actions
window.DEBUG.request = require('request')

export default () => {
  return <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>
}
