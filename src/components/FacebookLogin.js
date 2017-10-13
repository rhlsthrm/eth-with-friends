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
import FacebookLogin from 'react-facebook-login'
import Chip from 'material-ui/Chip'

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
    accountAddress: '',
    fbId: null,
    name: ''
  }

  componentDidMount () {}

  componentWillReceiveProps (nextProps) {
    if (this.props.web3 !== nextProps.web3 && nextProps.web3) {
      nextProps.web3.eth.getAccounts((error, accounts) => {
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

  setIdentity = () => {
    let { socialIdentityLinker, fbId, accessToken } = this.state
    let socialIdentityLinkerInstance

    socialIdentityLinker
      .deployed()
      .then(instance => {
        socialIdentityLinkerInstance = instance
        return socialIdentityLinkerInstance.setIdentity(fbId, accessToken, {
          value: 50000000000000
        })
      })
      .then(result => {
        console.log(`Successfully set identity! ${result}`)
      })
      .catch(e => {
        console.log(e)
      })
  }

  checkIdentity = facebookId => {
    let { socialIdentityLinker } = this.state
    let socialIdentityLinkerInstance

    socialIdentityLinker
      .deployed()
      .then(instance => {
        socialIdentityLinkerInstance = instance
        return socialIdentityLinkerInstance.facebookIdentity(facebookId)
      })
      .then(mappedAddress => {
        this.setState({ mappedAddress })
      })
  }

  responseFacebook = response => {
    console.log(response)
    if (response.id) {
      this.setState({
        fbId: response.id,
        name: response.name,
        accessToken: response.accessToken
      })
    }
  }

  render () {
    const classes = this.props.classes
    const { fbId, name, mappedAddress } = this.state
    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Grid container direction='column'>
              {fbId
                ? <Typography type='headline' component='h2'>
                    Logged in as {name}
                </Typography>
                : <FacebookLogin
                  appId='119959865356560'
                  autoLoad
                  fields='name,email,picture'
                  scope='public_profile,user_friends'
                  callback={this.responseFacebook}
                  />}
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
              <Grid item xs={12}>
                <Grid container direction='row'>
                  {mappedAddress
                    ? <div>
                      <Typography type='body1' className={classes.pos}>
                          My mapped wallet address:
                        </Typography>
                      <Chip label={mappedAddress} />
                    </div>
                    : <Typography type='body1' className={classes.pos}>
                        No wallet address mapped.
                      </Typography>}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              className={classes.button}
              onClick={() => this.checkIdentity(fbId)}
            >
              Check My Facebook Identity
            </Button>
            <Button
              color='primary'
              className={classes.button}
              onClick={() => this.setIdentity()}
            >
              Set My Wallet Address
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
