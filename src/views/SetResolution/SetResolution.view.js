import Resolutions from './../Resolutions/Resolutions.view';
import style from './SetResolution.module.css';
import Dialog from './../Dialog/Dialog.view';
import dialogStyle from '../Dialog/Dialog.module.css';
import MainButton from '../MainButton/MainButton.view';
import bottle from './../../lib/bottle';

export default  bottle.container.injectState(({history, state, effects}) => (
  <Dialog title="Set World Resolution"
          buttons={[<MainButton onClick={() => {
            effects.resetElevationSize();
            history.push('/world');
          }}>Set Resolution</MainButton>]}>
    <Resolutions/>
    <p className={dialogStyle.body}>Lowering resolution discards some elevation.</p>
  </Dialog>
));