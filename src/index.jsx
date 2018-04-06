import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './views/App'
import main from './style/main.css';

const root = document.getElementById('root')
const load = () => render((
  <AppContainer style={main['AppContainer']}>
    <App />
  </AppContainer>
), root)

// This is needed for Hot Module Replacement
if (module.hot) {
  module.hot.accept('./views/App', load)
}

load()
