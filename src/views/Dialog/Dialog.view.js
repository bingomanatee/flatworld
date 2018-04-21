import style from './Dialog.module.css';

export default ({title, children, buttons}) => (<div className={style.threeNoticeFrame}>
  <div className={style.threeNotice}>
    {title ? <h2 className={style.threeNoticeTitle}>{title}</h2> : ''}
    {children || ''}
    {(buttons && buttons.length) ? (<div className={style.buttonList}>
      {buttons}
    </div>) : '' }
  </div>
</div>)