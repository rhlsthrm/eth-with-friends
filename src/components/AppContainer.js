/* global FB */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import FacebookLogin from 'react-facebook-login'
import Grid from 'material-ui/Grid'
import FacebookLoginComponent from './FacebookLogin'
import FriendsList from './FriendsList'
import SocialIdentityLinker
  from '../../build/contracts/SocialIdentityLinker.json'

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
})

class AppContainer extends Component {
  state = {
    fbId: '',
    web3detected: false,
    myFriends: []
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.web3 !== nextProps.web3 && nextProps.web3) {
      nextProps.web3.eth.getAccounts((error, accounts) => {
        if (this.error) {
          console.log(error)
          return
        }
        this.setState({
          accountAddress: accounts[0],
          web3detected: true
        })
        this.initContract(nextProps.web3)
      })
    }
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

  responseFacebook = async response => {
    console.log(response)
    if (response.id) {
      this.setState({
        fbId: response.id,
        name: response.name,
        photoURL: response.picture.data.url,
        accessToken: response.accessToken
      })
      FB.api(`/me/friends`, { fields: 'id,name,picture' }, response => {
        console.log(response)
        this.setState({
          myFriends: response.data
        })
      })
    } else {
      this.setState({ fbId: null })
    }
  }

  logoutFB = () => {
    FB.logout()
    this.setState({ fbId: null })
  }

  render () {
    const { classes, web3 } = this.props
    const {
      fbId,
      name,
      photoURL,
      accessToken,
      socialIdentityLinker,
      web3detected,
      myFriends
    } = this.state
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <FacebookLoginComponent
              web3={web3}
              fbLoginButton={
                <FacebookLogin
                  appId='119959865356560'
                  autoLoad
                  fields='name,email,picture'
                  scope='public_profile,user_friends'
                  callback={this.responseFacebook}
                />
              }
              logoutFB={this.logoutFB}
              fbId={fbId}
              name={name}
              photoURL={photoURL}
              accessToken={accessToken}
              socialIdentityLinker={socialIdentityLinker}
              web3detected={web3detected}
            />
          </Grid>
          <Grid item xs={12}>
            <FriendsList
              myFriends={myFriends}
              socialIdentityLinker={socialIdentityLinker}
            />
          </Grid>
        </Grid>
      </div>
    )
  }
}

AppContainer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(AppContainer)
