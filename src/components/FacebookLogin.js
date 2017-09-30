/* global FB */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import green from 'material-ui/colors/green'
import Switch from 'material-ui/Switch'

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
  checked: {
    color: green[500],
    '& + $bar': {
      backgroundColor: green[500]
    }
  }
})

class FacebookLoginComponent extends Component {
  state = {
    checkedA: true,
    checkedB: false,
    checkedE: true
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

  responseFacebook (response) {
    console.log(response)
  }
  render () {
    const classes = this.props.classes

    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <div
              className='fb-login-button'
              data-max-rows='1'
              data-size='large'
              data-button-type='continue_with'
              data-show-faces='false'
              data-auto-logout-link='false'
              data-use-continue-as='true'
            />
            <Switch
              classes={{
                checked: classes.checked,
                bar: classes.bar
              }}
              checked={this.state.checkedE}
              aria-label='checkedD'
            />
          </CardContent>
        </Card>
      </div>
    )
  }
}

FacebookLoginComponent.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FacebookLoginComponent)
