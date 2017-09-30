import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'

import Grid from 'material-ui/Grid'
import FacebookLogin from './FacebookLogin'

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

function AppContainer (props) {
  const classes = props.classes

  return (
    <div className={classes.root}>
      <Grid item xs={12}>
        <FacebookLogin web3={props.web3} />
      </Grid>
    </div>
  )
}

AppContainer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(AppContainer)
