import React, {PropTypes} from 'react'
import {compose, setDisplayName, withProps, setPropTypes, defaultProps} from 'recompose'
import CSSModules from 'react-css-modules'
import styles from './Avatar.css'
import loadingState from './loadingState'
import {initials} from 'utils/string'

function Avatar({url, initials, name, onLoad, onError, isLoaded, hasError, isLoading, style}) {
    const styleName = (hasError === true || isLoading === true) ? 'Initials' : 'Avatar'

    return (
        <div styleName={styleName} data-initials={initials} style={style} >
            <img src={url} alt={initials} title={name} onLoad={onLoad} onError={onError} />
        </div>
    )
}

export default compose(
    setDisplayName('Avatar'),
    setPropTypes({
        name: PropTypes.string.isRequired,
        url: PropTypes.string,
        size: PropTypes.number,
    }),
    defaultProps({
        size: 60,
    }),
    withProps(({name, size}) => ({
        initials: initials(name),
        style: {
            height: size,
            width: size,
            fontSize: size < 50 ? '0.75em' : '1em',
        }
    })),
    loadingState,
    CSSModules(styles),
)(Avatar)
