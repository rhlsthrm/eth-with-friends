import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import AppBar from './components/AppBar'
import AppContainer from './components/AppContainer'
import SocialIdentityLinker from '../build/contracts/SocialIdentityLinker.json'

class App extends Component {
  state = {
    web3: null
  }

  componentWillMount () {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3,
          web3detected: true,
          accountAddress: results.web3.eth.accounts[0]
        })

        // Instantiate contract once web3 provided.
        this.initContract(results.web3)
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  initContract = web3 => {
    const contract = require('truffle-contract')
    const socialIdentityLinker = contract(SocialIdentityLinker)
    socialIdentityLinker.setProvider(web3.currentProvider)
    socialIdentityLinker.defaults({ from: web3.eth.accounts[0] })
    this.setState({
      socialIdentityLinker
    })
  }

  render () {
    const {
      socialIdentityLinker,
      web3detected,
      web3,
      accountAddress
    } = this.state
    return (
      <div>
        <AppBar />
        <AppContainer
          web3={web3}
          socialIdentityLinker={socialIdentityLinker}
          web3detected={web3detected}
          accountAddress={accountAddress}
        />
      </div>
    )
  }
}

export default App
