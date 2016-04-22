import React, { PropTypes } from 'react'
import { compose, setDisplayName, setPropTypes, mapProps } from 'recompose'
import CSSModules from 'react-css-modules'
import { ChevronLeft, ChevronRight } from '../icons'
import Button from '../button'
import styles from './Pagination.css'

function K() {}

const LEFT = 'Left'
const RIGHT = 'Right'

const icons = new Map([
    [LEFT, <ChevronLeft inverse />],
    [RIGHT, <ChevronRight inverse />],
])
const hints = new Map([
    [LEFT, 'Older'],
    [RIGHT, 'Newer'],
])

function Segment({
    position,
    onNavigate = K,
    hint = hints.get(position),
    children
}) {
    return (
        <div styleName={position}>
            <div styleName='Navigation'>
                <Button onClick={onNavigate}>
                    {icons.get(position)}
                </Button>
            </div>
            <div styleName='Description'>
                <div styleName='Hint'>
                    {hint}
                </div>
                {children}
            </div>
        </div>
    )
}

const propTypes = {
    onNavigate: PropTypes.func.isRequired,
    hint: PropTypes.string.isRequired,
    children: PropTypes.string.isRequired,
}

function segment(position) {
    return compose(
        setDisplayName(position),
        setPropTypes(propTypes),
        mapProps(props => ({ ...props, position }))
    )(CSSModules(Segment, styles))
}

export const Left = segment(LEFT)
export const Right = segment(RIGHT)
export const Center = CSSModules(Middle, styles)

function Middle({ children }) {
    return (
        <div styleName='Center'>
            {children}
        </div>
    )
}