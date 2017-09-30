/* global FB */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import green from 'material-ui/colors/green'
import Switch from 'material-ui/Switch'
import Grid from 'material-ui/Grid'
import TextField from 'material-ui/TextField'
import SocialIdentityLinker
  from '../../build/contracts/SocialIdentityLinker.json'

const styles = theme => ({
  card: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    color: theme.palette.text.secondary
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary
  },
  bar: {},
  checked: {
    color: green[500],
    '& + $bar': {
      backgroundColor: green[500]
    }
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  }
})

class FacebookLoginComponent extends Component {
  state = {
    web3detected: false,
    accountAddress: ''
  }

  componentDidMount () {
    window.fbAsyncInit = function () {
      FB.init({
        appId: '119959865356560',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.10'
      })
      FB.AppEvents.logPageView()
    }
    ;(function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }
      js = d.createElement(s)
      js.id = id
      js.src = '//connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    })(document, 'script', 'facebook-jssdk')
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.web3 !== nextProps.web3 && nextProps.web3) {
      nextProps.web3.eth.getAccounts((error, accounts) => {
        this.setState({
          accountAddress: accounts[0],
          web3detected: true
        })
      })
    }
  }

  handleClickSetID () {
    const contract = require('truffle-contract')
    const socialIdentityLinker = contract(SocialIdentityLinker)
    socialIdentityLinker.setProvider(this.props.web3.currentProvider)
    let socialIdentityLinkerInstance

    socialIdentityLinker.deployed().then(instance => {
      socialIdentityLinkerInstance = instance
    })
  }

  render () {
    const classes = this.props.classes
    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Grid container direction='column'>
              <div
                className='fb-login-button'
                data-max-rows='1'
                data-size='large'
                data-button-type='continue_with'
                data-show-faces='false'
                data-auto-logout-link='false'
                data-use-continue-as='true'
              />
              <Grid item xs={12}>
                <Grid container direction='row'>
                  <Typography type='body1' className={classes.pos}>
                    Web3 Status:
                  </Typography>
                  <Switch
                    classes={{
                      checked: classes.checked,
                      bar: classes.bar
                    }}
                    checked={this.state.web3detected}
                    aria-label='web3detected'
                  />
                </Grid>
              </Grid>
              <TextField
                id='accountAddress'
                label='Detected Account Address'
                className={classes.textField}
                disabled
                value={this.state.accountAddress}
                onChange={() => {}}
                margin='normal'
              />
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              raised
              color='primary'
              className={classes.button}
              onClick={this.handleClickSetID}
            >
              Set Wallet Address
            </Button>
          </CardActions>
        </Card>
      </div>
    )
  }
}

FacebookLoginComponent.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FacebookLoginComponent)
