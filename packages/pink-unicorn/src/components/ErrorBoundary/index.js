import { Component } from 'react'
import { Container, Alert } from 'reactstrap'

export default class ErrorBoundary extends Component {
  state = { error: null }

  componentDidCatch (error, info) {
    this.setState({
      error,
    })
  }

  render () {
    if (this.state.error) {
      return (
        <Container className="themed-container">
          <Alert color="danger">
            <h4 className="alert-heading">Something went wrong.</h4>
            <code style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error.message}
            </code>
          </Alert>
        </Container>
      )
    }

    return this.props.children
  }
}
