import React, {Component} from 'react'
import {ipcRenderer} from 'electron'

import Intro from '../panes/Intro'

import Pane from '../components/Pane'
import PaneContainer from '../components/PaneContainer'
import Heartbeat from '../components/Heartbeat'
import Loader from '../panes/Loader'

const INTRO = 'intro'
const INTITIALZING = 'initializing'
const ERROR = 'error'

export default class Welcome extends Component {
  state = {
    status: INTRO,
    error: void 0,
    configPath: ''
  }

  _onInitializing = () => {
    this.setState({status: INTITIALZING})
  }

  _onError = (_, error) => {
    this.setState({
      status: ERROR,
      error
    })
  }

  _onConfigPath = (_, path) => {
    this.setState({configPath: path})
  }

  _startInstallation = (options) => {
    ipcRenderer.send('install', options)
  }

  componentDidMount () {
    ipcRenderer.on('initializing', this._onInitializing)
    ipcRenderer.on('initialization-error', this._onError)
    ipcRenderer.on('setup-config-path', this._onConfigPath)
  }

  componentWillUnmount () {
    ipcRenderer.removeListener('initializing', this._onInitializing)
    ipcRenderer.removeListener('initialization-error', this._onError)
    ipcRenderer.removeListener('setup-config-path', this._onConfigPath)
  }

  render () {
    switch (this.state.status) {
      case INTRO:
        return (
          <PaneContainer>
            <Pane className='heartbeat-pane'>
              <Heartbeat />
            </Pane>
            <Intro
              key='intro'
              onInstallClick={this._startInstallation}
              configPath={this.state.configPath} />
          </PaneContainer>
        )
      case ERROR:
        return (
          <div key='error'>{this.state.error}</div>
        )
      default:
        return <PaneContainer><Loader /></PaneContainer>
    }
  }
}