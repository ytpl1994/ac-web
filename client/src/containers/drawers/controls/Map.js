import React, {PropTypes} from 'react'
import {createStructuredSelector} from 'reselect'
import {compose, withHandlers, getContext} from 'recompose'
import {connect} from 'react-redux'
import CSSModule from 'react-css-modules'
import {neverUpdate} from 'compose'
import {zoomIn, zoomOut} from 'actions/map'
import {computeOffset} from 'selectors/map/bounds'
import {Remove, Add} from 'components/icons'
import Button, {SUBTILE} from 'components/button'
import styles from './Map.css'

// TODO: Probably use the mapboxgl zoom control

function ZoomControl({zoomIn, zoomOut}) {
    return (
        <div styleName='ZoomControl' >
            <Button
                onClick={zoomIn}
                kind={SUBTILE}
                icon={<Add />}
                title='Zoom in' />
            <Button
                onClick={zoomOut}
                kind={SUBTILE}
                icon={<Remove />}
                title='Zoom out' />
        </div>
    )
}

export default compose(
    getContext({
        location: PropTypes.object.isRequired,
    }),
    connect(createStructuredSelector({
        computeOffset,
    }), {
        zoomIn,
        zoomOut,
    }),
    withHandlers({
        zoomIn: props => event => {
            props.zoomIn({
                offset: props.computeOffset()
            })
        },
        zoomOut: props => event => {
            props.zoomOut({
                offset: props.computeOffset()
            })
        },
    }),
    neverUpdate,
    CSSModule(styles),
)(ZoomControl)
