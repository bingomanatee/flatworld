import style from './MainButton.module.css';

export default ({children, onClick}) => (<button className={style.MainButton} onClick={onClick}>{children || 'Save'}</button>);