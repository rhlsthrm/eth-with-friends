import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import GithubCircle from 'mdi-material-ui/GithubCircle'
import IconButton from 'material-ui/IconButton'

const styles = theme => ({
  root: {
    // marginTop: theme.spacing.unit * 3,
    width: '100%'
  },
  flex: {
    flex: 1
  }
})

function SimpleAppBar (props) {
  const classes = props.classes
  return (
    <div className={classes.root}>
      <AppBar position='fixed'>
        <Toolbar>
          <Typography type='title' color='inherit' className={classes.flex}>
            ETH With Friends
          </Typography>
          <IconButton
            color='contrast'
            aria-label='GitHub'
            onClick={() =>
              window.location.assign(
                'https://github.com/rhlsthrm/ethereum-social-identity'
              )}
          >
            <GithubCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  )
}

SimpleAppBar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SimpleAppBar)
