import style from './Dialog.module.css';

export default ({title, children, buttons}) => (<div className={style.DialogFrame}>
  <div className={style.Dialog}>
    {title ? <h2 className={style.DialogHead}>{title}</h2> : ''}
    {children || ''}
    {(buttons && buttons.length) ? (<div className={style.buttonList}>
      {buttons}
    </div>) : '' }
  </div>
</div>)