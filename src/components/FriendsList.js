import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Avatar from 'material-ui/Avatar'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'

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
    marginLeft: 12
  }
})

class FriendsList extends Component {
  state = {
    friendsWithAddress: []
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

  render () {
    const { classes } = this.props
    const { friendsWithAddress } = this.state

    return (
      <Paper className={classes.root}>
        <Typography type='headline' component='h2' className={classes.title}>
          Friends
        </Typography>
        <List>
          {friendsWithAddress.map((friend, index) => {
            return (
              <ListItem button key={`friendlist-${index}`}>
                <Avatar alt={friend.name} src={friend.picture.data.url} />
                <ListItemText
                  primary={friend.name}
                  secondary={friend.address}
                />
              </ListItem>
            )
          })}
        </List>
      </Paper>
    )
  }
}

FriendsList.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FriendsList)
