import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Avatar from 'material-ui/Avatar'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { LinearProgress } from 'material-ui/Progress'

const styles = theme => ({
  root: {
    width: '100%'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper
  },
  gridList: {
    width: 500,
    height: 450
  },
  avatar: {
    margin: 10
  },
  bigAvatar: {
    width: 60,
    height: 60
  },
  title: {
    paddingLeft: 12,
    paddingTop: 12
  }
})

class FriendsList extends Component {
  state = {
    friendsWithAddress: [],
    openDialog: false,
    sendAmount: 0,
    requestAmount: 0,
    selectedFriend: {},
    sendAmountError: false,
    requestAmountError: false,
    sendEthStatus: 'none',
    requestEthStatus: 'none'
  }

  async componentWillReceiveProps (nextProps) {
    if (
      this.props.myFriends !== nextProps.myFriends &&
      nextProps.myFriends.length > 0
    ) {
      const inst = await this.props.socialIdentityLinker.deployed()
      const promises = []
      nextProps.myFriends.forEach(friend => {
        promises.push(inst.facebookIdentity(friend.id))
      })
      const results = await Promise.all(promises)
      console.log(results)
      const friendsWithAddress = nextProps.myFriends.map((friend, index) => {
        friend.address = results[index]
        return friend
      })
      this.setState({
        friendsWithAddress
      })
    }
  }

  handleListItemClick = friend => () => {
    this.setState({ openDialog: true, selectedFriend: friend })
  }

  handleDialogClose = () => {
    this.setState({
      openDialog: false,
      sendEthStatus: 'none',
      sendEthErrorBool: false,
      sendEthErrorObj: {},
      sentTxHash: ''
    })
  }

  handleSendAmountChange = event => {
    this.setState({
      sendAmountError: parseFloat(event.target.value) < 0,
      sendAmount: event.target.value
    })
  }

  handleRequestAmountChange = event => {
    this.setState({
      requestAmountError: parseFloat(event.target.value) < 0,
      requestAmount: event.target.value
    })
  }  

  handleSendEth = () => {
    const { web3 } = this.props
    const { selectedFriend, sendAmountError, sendAmount } = this.state
    console.log(selectedFriend.address)
    if (!sendAmountError) {
      this.setState({ sendEthStatus: 'sending' })
      web3.eth.sendTransaction(
        {
          from: web3.eth.accounts[0],
          to: selectedFriend.address,
          value: web3.toWei(sendAmount, 'ether')
        },
        (error, result) => {
          if (error) {
            console.log(error)
            this.setState({
              sendEthStatus: 'sent',
              sendEthErrorBool: true,
              sendEthErrorObj: error
            })
          } else {
            console.log(result)
            this.setState({ sendEthStatus: 'sent', sentTxHash: result })
          }
        }
      )
    }
  }

  async handleRequestEth(requestAmount) {
    const { socialIdentityLinker } = this.props
    const inst = await socialIdentityLinker.deployed()
    this.setState({requestEthStatus: 'requesting'})
    try {
      await inst.requestEth(selectedFriend.address, requestAmount)
    } catch (e) {
      this.setState({ requestAmountError: 'error', })
      console.log(e)
    } finally {
      this.setState({ requestEthStatus: 'requested', })
    }
  }

  render () {
    const { classes } = this.props
    const {
      friendsWithAddress,
      openDialog,
      selectedFriend,
      sendAmount,
      sendAmountError,
      sendEthStatus,
      sentTxHash,
      sendEthErrorBool,
      sendEthErrorObj
    } = this.state

    return (
      <Paper className={classes.root}>
        <Typography type='headline' component='h2' className={classes.title}>
          My Friends
        </Typography>
        <List>
          {friendsWithAddress.length > 0
            ? friendsWithAddress.map((friend, index) => {
              return (
                <ListItem
                  button
                  key={`friendlist-${index}`}
                  onClick={this.handleListItemClick(friend)}
                  >
                  <Avatar alt={friend.name} src={friend.picture.data.url} />
                  <ListItemText
                    primary={friend.name}
                    secondary={friend.address}
                    />
                </ListItem>
              )
            })
            : <ListItem>
              <ListItemText primary='No friends found.' secondary=':(' />
            </ListItem>}
        </List>
        {
          {
            none: (
              <Dialog open={openDialog} onRequestClose={this.handleDialogClose}>
                <DialogTitle>Send ETH to {selectedFriend.name}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Wallet Address: {selectedFriend.address}
                  </DialogContentText>
                  <FormControl
                    className={classes.formControl}
                    error={sendAmountError}
                  >
                    <InputLabel htmlFor='sendAmount'>Amount</InputLabel>
                    <Input
                      id='sendAmount'
                      value={sendAmount}
                      onChange={this.handleSendAmountChange}
                      endAdornment={
                        <InputAdornment position='end'>ETH</InputAdornment>
                      }
                      type='number'
                    />
                    <FormHelperText>
                      {sendAmountError
                        ? 'Please specify a valid amount of ETH to send.'
                        : 'Specify amount of ETH to send.'}
                    </FormHelperText>
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleDialogClose} color='default'>
                    Cancel
                  </Button>
                  <Button
                    onClick={this.handleSendEth}
                    color='primary'
                    disabled={sendAmountError}
                  >
                    Send
                  </Button>
                </DialogActions>
              </Dialog>
            ),
            sending: (
              <Dialog
                open={openDialog}
                onRequestClose={this.handleDialogClose}
                ignoreBackdropClick
                ignoreEscapeKeyUp
              >
                <DialogTitle>Sending in progress...</DialogTitle>
                <DialogContent>
                  <LinearProgress color='accent' />
                </DialogContent>
              </Dialog>
            ),
            sent: (
              <Dialog open={openDialog} onRequestClose={this.handleDialogClose}>
                <DialogTitle>
                  {sendEthErrorBool
                    ? 'Error Sending ETH'
                    : 'ETH sent successfully!'}
                </DialogTitle>
                <DialogContent>
                  {sendEthErrorBool
                    ? <DialogContentText>
                      {sendEthErrorObj.toString()}
                    </DialogContentText>
                    : <DialogContentText>
                        Tx hash:
                        {' '}
                      <a href={`https://kovan.etherscan.io/tx/{sentTxHash}`}>
                        {sentTxHash}
                      </a>
                    </DialogContentText>}
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleDialogClose} color='default'>
                    Done
                  </Button>
                </DialogActions>
              </Dialog>
            )
          }[sendEthStatus]
        }
      </Paper>
    )
  }
}

FriendsList.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FriendsList)
