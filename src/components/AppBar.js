import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'

const styles = theme => ({
  root: {
    // marginTop: theme.spacing.unit * 3,
    width: '100%'
  }
})

function SimpleAppBar (props) {
  const classes = props.classes
  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <Typography type='title' color='inherit'>
            Ethereum Facebook Identity Linker
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}

SimpleAppBar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SimpleAppBar)
