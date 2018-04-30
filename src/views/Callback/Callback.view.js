import {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button} from 'react-md';
import bottle from '../../lib/bottle';

export default bottle.container.injectState(class CallbackComponent extends Component {

  componentDidMount () {
    if (/access_token|id_token|error/.test(location.hash)) {
      this.props.effects.handleAuthentication()
          .then(() => {
            this.props.history.replace(this.props.state.loginLocation || '/');
          })
    }
  }

  render () {
    return <div><h1>Welcome to Flatworld!</h1>
      <p>Returning to previous location ... <Link to={this.props.state.loginLocation || '/'}><Button primary raised>Resume
        Site</Button></Link></p>
    </div>
  }
});
