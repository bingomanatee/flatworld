import style from './Overlay.module.css';

export default ({zIndex, children}) => (<div style={({zIndex : zIndex || 1000 })}
                                             className={style.OverlayFrame}>
  {children}
</div>)