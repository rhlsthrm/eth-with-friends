import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import green from 'material-ui/colors/green'
import red from 'material-ui/colors/red'
import Grid from 'material-ui/Grid'
import TextField from 'material-ui/TextField'
import Chip from 'material-ui/Chip'
import { CircularProgress } from 'material-ui/Progress'
import Avatar from 'material-ui/Avatar'
import Web from 'mdi-material-ui/Web'
import Badge from 'material-ui/Badge'
import Popover from 'material-ui/Popover'

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
    marginLeft: 10,
    color: theme.palette.text.secondary
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative'
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  bigAvatar: {
    width: 60,
    height: 60
  },
  avatar: {
    margin: 10
  },
  badge: {
    paddingTop: 12
  },
  paper: {
    padding: theme.spacing.unit
  },
  popover: {
    pointerEvents: 'none'
  }
})

class FacebookLoginComponent extends Component {
  state = {
    accountAddress: '',
    anchorEl: null
  }

  setIdentity = async () => {
    let { fbId, accessToken, socialIdentityLinker } = this.props

    const inst = await socialIdentityLinker.deployed()
    this.setState({ loadingSetIdentity: true })
    try {
      const result = await inst.setIdentity(fbId, accessToken, {
        value: 50000000000000
      })
      console.log(result)
    } catch (e) {
      console.log(e)
    } finally {
      this.setState({ loadingSetIdentity: false })
    }
  }

  checkIdentity = async facebookId => {
    let { socialIdentityLinker } = this.props
    const inst = await socialIdentityLinker.deployed()
    this.setState({
      loadingCheckIdentity: true
    })
    try {
      const mappedAddress = await inst.facebookIdentity(facebookId)
      this.setState({ mappedAddress })
    } catch (e) {
      console.log(e)
    } finally {
      this.setState({ loadingCheckIdentity: false })
    }
  }

  handleBadgePopoverOpen = event => {
    this.setState({ anchorEl: event.target })
  }

  handleBadgePopoverClose = () => {
    this.setState({ anchorEl: null })
  }

  render () {
    const {
      classes,
      fbLoginButton,
      logoutFB,
      fbId,
      name,
      photoURL,
      web3detected,
      accountAddress
    } = this.props
    const {
      mappedAddress,
      loadingCheckIdentity,
      loadingSetIdentity,
      anchorEl
    } = this.state
    const open = !!anchorEl
    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Grid container direction='column' spacing={16}>
              <Grid item xs={12}>
                <Badge
                  style={{
                    colorPrimary: red[500],
                    colorAccent: green[500]
                  }}
                  badgeContent=''
                  color={web3detected ? 'accent' : 'primary'}
                  onMouseOver={this.handleBadgePopoverOpen}
                  onMouseOut={this.handleBadgePopoverClose}
                >
                  <Web />
                </Badge>
                <Popover
                  className={classes.popover}
                  classes={{
                    paper: classes.paper
                  }}
                  open={open}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                  }}
                  onRequestClose={this.handlePopoverClose}
                >
                  <Typography>
                    {web3detected
                      ? 'Web3 is detected!'
                      : 'Web3 is not detected. Please use MetaMask or another tool to inject Web3.'}
                  </Typography>
                </Popover>
              </Grid>
              <Grid item xs={12}>
                {fbId
                  ? <Chip
                    avatar={<Avatar src={photoURL} />}
                    label={name}
                    onRequestDelete={logoutFB}
                    className={classes.chip}
                    />
                  : fbLoginButton}
              </Grid>
              <TextField
                id='accountAddress'
                label='Detected Account Address'
                className={classes.textField}
                disabled
                value={accountAddress || 'No address detected.'}
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
                      <Chip label={mappedAddress} className={classes.pos} />
                    </div>
                    : <Typography type='body1' className={classes.pos} />}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <div className={classes.wrapper}>
              <Button
                className={classes.button}
                onClick={() => this.checkIdentity(fbId)}
                disabled={loadingCheckIdentity}
              >
                Check My Facebook Identity
              </Button>
              {loadingCheckIdentity &&
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />}
            </div>
            <div className={classes.wrapper}>
              <Button
                color='primary'
                className={classes.button}
                onClick={() => this.setIdentity()}
                disabled={loadingSetIdentity}
              >
                Set My Wallet Address
              </Button>
              {loadingSetIdentity &&
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />}
            </div>
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
