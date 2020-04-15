import classnames from 'classnames'
import style from './index.module.scss'

export default function Icon (props) {
  return (
    <svg
      role="img"
      aria-hidden="true"
      focusable="false"
      className={classnames(props.className, {
        [ style.root ]: true,
        [ style[`size${props.size || 'sm'}`] ]: true,
        [ style.spin ]: Boolean(props.spin),
      })}
      style={{
        width: props.width ? props.width : (props.height ? '100%' : undefined),
        height: props.height ? props.height : (props.width ? '100%' : undefined),
      }}
    >
      {props.title ? <title>{props.title}</title> : null}
      <use xlinkHref={`#${props.name}`} />
      <rect height="100%" width="100%" fill="transparent"></rect>
    </svg>
  )
}
