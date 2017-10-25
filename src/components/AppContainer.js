/* global FB */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import FacebookLogin from 'react-facebook-login'
import Grid from 'material-ui/Grid'
import FacebookLoginComponent from './FacebookLogin'
import FriendsList from './FriendsList'

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 72
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
    myFriends: []
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
    const {
      classes,
      web3,
      socialIdentityLinker,
      web3detected,
      accountAddress
    } = this.props
    const { fbId, name, photoURL, accessToken, myFriends } = this.state
    return (
      <div className={classes.root}>
        <Grid container spacing={8}>
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
              accountAddress={accountAddress}
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
