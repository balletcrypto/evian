import React, { Component } from 'react'
import './Footer.css'
import { Container } from 'react-bootstrap'

export class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <Container>
          <div className="text-muted">Mintery &#169; {new Date().getFullYear()}</div>
        </Container>
      </footer>
    )
  }
}