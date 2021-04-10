import { Component } from 'react'
import {
  node,
  element,
} from 'prop-types'

import report from './ErrorReport'

export default class ErrorBoundary extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
    }
  }

  componentDidCatch (error, errorInfo) {
    if (process.env.NODE_ENV === 'production') {
      report(error, errorInfo)
    }

    this.setState({
      error,
    })
  }

  render () {
    const { children, CrashReportComponent } = this.props
    const { error } = this.state

    return (
      error ?
        CrashReportComponent :
        children
    )
  }
}

ErrorBoundary.propTypes = {
  children: node,
  CrashReportComponent: element,
}

ErrorBoundary.defaultProps = {
  children: null,
  CrashReportComponent: null,
}
