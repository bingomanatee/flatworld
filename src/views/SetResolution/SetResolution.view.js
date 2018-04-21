import Resolutions from './../Resolutions/Resolutions.view';
import style from './SetResolution.module.css';
import Dialog from './../Dialog/Dialog.view';
import dialogStyle from '../Dialog/Dialog.module.css';
import MainButton from '../MainButton/MainButton.view';

export default ({history}) => (
  <Dialog title="Set World Resolution" buttons={[<MainButton onClick={() => history.push('/world')}>Set Resolution</MainButton>]}>
    <Resolutions/>
    <p className={dialogStyle.body}>This will reset the world data.</p>
  </Dialog>
);