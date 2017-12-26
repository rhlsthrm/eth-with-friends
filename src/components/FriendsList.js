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
    openSendDialog: false,
    openRequestDialog: false,
    sendAmount: 0,
    requestAmount: 0,
    selectedFriend: {},
    sendAmountError: false,
    requestAmountError: false,
    sendEthStatus: 'none',
    requestEthStatus: 'none',
    descriptions:"",
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

  handleListItemClickSend = friend => () => {
    this.setState({ openSendDialog: true, selectedFriend: friend })
  }

  handleListItemClickRequest = friend => () => {
    this.setState({ openRequestDialog: true, selectedFriend: friend })
  }

  handleDialogClose = () => {
    this.setState({
      openSendDialog: false,
      openRequestDialog: false,
      sendEthStatus: 'none',
      sendEthErrorBool: false,
      sendEthErrorObj: {},
      requestEthStatus: 'none',
      requestEthErrorBool: false,
      requestEthErrorObj: {},      
      sentTxHash: '',
      requestTxHash:''
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

  handleDescriptionChange = event => {
    this.setState({
      descriptions: event.target.value
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

  handleRequestEth = async () => {
    const { socialIdentityLinker, web3 } = this.props
    const { selectedFriend, requestAmountError, requestAmount, descriptions } = this.state
    const inst = await socialIdentityLinker.deployed()
    let tx = ""
    this.setState({requestEthStatus: 'requesting'})
    try {
      tx = await inst.requestEth(selectedFriend.address, web3.toWei(requestAmount, "ether"), descriptions )
    } catch (e) {
      this.setState({ requestAmountError: 'error', })
      console.log(e)
    } finally {
      this.setState({ requestEthStatus: 'requested', requestTxHash: tx })
    }
  }

  render () {
    const { classes } = this.props
    const {
      friendsWithAddress,
      openSendDialog,
      openRequestDialog,
      selectedFriend,
      sendAmount,
      requestAmount,
      sendAmountError,
      requestAmountError,
      sendEthStatus,
      requestEthStatus,
      sentTxHash,
      requestTxHash,
      sendEthErrorBool,
      sendEthErrorObj,
      requestEthErrorBool,
      requestEthErrorObj,
      descriptions      
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
                  >
                  <Avatar alt={friend.name} src={friend.picture.data.url} />
                  <ListItemText
                    primary={friend.name}
                    secondary={friend.address}
                    />
                    <Button raised color="primary" 
                            className={classes.button}
                            onClick={this.handleListItemClickSend(friend)}>
                      Send
                    </Button>
                    <Button raised color="accent" 
                            className={classes.button}
                            onClick={this.handleListItemClickRequest(friend)}>
                      Request
                    </Button>                    
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
              <Dialog open={openSendDialog} onRequestClose={this.handleDialogClose}>
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
                open={openSendDialog}
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
              <Dialog open={openSendDialog} onRequestClose={this.handleDialogClose}>
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

        {
          {
            none: (
              <Dialog open={openRequestDialog} onRequestClose={this.handleDialogClose}>
                <DialogTitle>Request ETH to {selectedFriend.name}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Wallet Address: {selectedFriend.address}
                  </DialogContentText>
                  <FormControl
                    className={classes.formControl}
                    error={requestAmountError}
                  >
                    <InputLabel htmlFor='requestAmount'>Amount</InputLabel>
                    <Input
                      id='requestAmount'
                      value={requestAmount}
                      onChange={this.handleRequestAmountChange}
                      endAdornment={
                        <InputAdornment position='end'>ETH</InputAdornment>
                      }
                      type='number'
                    />
                    <FormHelperText>
                      {sendAmountError
                        ? 'Please specify a valid amount of ETH to request.'
                        : 'Specify amount of ETH to request.'}
                    </FormHelperText>
                  </FormControl>
                  <FormControl
                  className={classes.formControl}
                  >
                  <InputLabel htmlFor='descriptions'>Description</InputLabel>
                  <Input
                    id='descriptions'
                    value={descriptions}
                    onChange={this.handleDescriptionChange}
                    type='text'
                  />
                </FormControl>                  
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleDialogClose} color='accent'>
                    Cancel
                  </Button>
                  <Button
                    onClick={this.handleRequestEth}
                    color='accent'
                    disabled={requestAmountError}
                  >
                    Request
                  </Button>
                </DialogActions>
              </Dialog>
            ),
            requesting: (
              <Dialog
                open={openRequestDialog}
                onRequestClose={this.handleDialogClose}
                ignoreBackdropClick
                ignoreEscapeKeyUp
              >
                <DialogTitle>Requesting in progress...</DialogTitle>
                <DialogContent>
                  <LinearProgress color='accent' />
                </DialogContent>
              </Dialog>
            ),
            requested: (
              <Dialog open={openSendDialog} onRequestClose={this.handleDialogClose}>
                <DialogTitle>
                  {requestEthErrorBool
                    ? 'Error Requesting ETH'
                    : 'ETH requested successfully!'}
                </DialogTitle>
                <DialogContent>
                  {requestEthErrorBool
                    ? <DialogContentText>
                      {requestEthErrorObj.toString()}
                    </DialogContentText>
                    : <DialogContentText>
                        Tx hash:
                        {' '}
                      <a href={`https://kovan.etherscan.io/tx/{requestTxHash}`}>
                        {requestTxHash}
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
          }[requestEthStatus]
        }        
      </Paper>
    )
  }
}

FriendsList.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FriendsList)
