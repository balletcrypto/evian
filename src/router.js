import React, { useState } from 'react';
import { ReactComponent as Logo } from './image/logo.svg'
import { ReactComponent as GitHubIcon } from './image/org_github.svg'
import App from './App';
import IntermediateGenerate from './IntermediateGenerate'
import Qrscan from './pages/Qrscan'
import useInterval from './utils/useInterval'
import './index.scss'
import {
    HashRouter as Router,
    Switch,
    Route,
    useRouteMatch
  } from "react-router-dom";
const resourcesArray = [
  "https://www.bitaddress.org",
  "https://www.infinitumbitcoins.com/bit2factor/",
  "https://github.com/bitcoinjs/bip38",
  "https://github.com/casascius/Bitcoin-Address-Utility",
  "https://github.com/nomorecoin/python-bip38-testing/blob/master/bip38.py",
  "https://github.com/pointbiz/bitaddress.org/blob/master/src/ninja.key.js",
]
export default () => {
  const isQrscanPage = window.location.pathname === '/qrscan'
  const [isOnline, setIsOnline] = useState(false)
  useInterval(() => {
    if (window.navigator.onLine) {
      setIsOnline(true)
    } else {
      setIsOnline(false)
    }
  }, 1000)

  return (
    <div>
      <div className="header">
        <a href="https://balletcrypto.com" target="_blank" ><Logo/></a>
        <a href="https://github.com/balletcrypto/evian" target="_blank"><GitHubIcon  className="github" /></a>
      </div>
      {isOnline ? <>
        <div className="network__wraper">
          <div className="network__title">
            WARNING
          </div>
          <div className="network__description">
            YOUR DEVICE IS CURRENTLY CONNECTED TO THE INTERNET. <br/>
            It may not be safe to run this program on your current computer or device.             
          </div>
        </div>      
      </> : ''}

      <Router>
        <Switch>
          <Route path="/bip38-intermediate-code">
            <IntermediateGenerate />
          </Route>
          <Route path="/qrscan">
            <Qrscan />
          </Route>
          <Route path="/">
            <App />
          </Route>
        </Switch>
      </Router>
      <div
        className="container linkerContent"
        style={{ display: isQrscanPage ? "none" : "block" }}
      >
        <div className="line"></div>
        <div className="linkWraper">
          <div className="linktext" >Ballet utilizes the open-source BIP38 standard for generating private keys and addresses. Please refer to the following links for more information about BIP38.</div>
          <h3>BIP38 Official Standard</h3>
            <a href="https://github.com/bitcoin/bips/blob/master/bip-0038.mediawiki" target="_blank" >https://github.com/bitcoin/bips/blob/master/bip-0038.mediawiki</a>
          <h3>More BIP38 Resources</h3>
          {resourcesArray.map(link => {
            return (
              <>
                <a href={link} target="_blank">{link}</a><br/>
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}