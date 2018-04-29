import Resolutions from './../Resolutions/Resolutions.view';
import style from './SetResolution.module.css';
import Dialog from './../Dialog/Dialog.view';
import dialogStyle from '../Dialog/Dialog.module.css';
import MainButton from '../MainButton/MainButton.view';

export default ({history}) => (
  <Dialog title="Set World Resolution"
          buttons={[<MainButton onClick={() => {
            let elevation = this.props.state.elevation.slice(0, this.props.state.resolution);
            this.props.effects.setElevation(elevation);
            history.push('/world');
          }}>Set Resolution</MainButton>]}>
    <Resolutions/>
    <p className={dialogStyle.body}>Lowering resolution discards some elevation.</p>
  </Dialog>
);