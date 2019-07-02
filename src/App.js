import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Home } from './pages/Home'
import { Layout } from './components/Layout'
import { NavigationBar } from './components/NavigationBar'
import { Footer}  from './components/Footer'


class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Router>
          <NavigationBar/>
          {/*<Jumbotron/>*/}
          <Layout>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route component={Home}/>
            </Switch>
          </Layout>
        </Router>
        <Footer/>
      </React.Fragment>
    )
  }
}

export default App
