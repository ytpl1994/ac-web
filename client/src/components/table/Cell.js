import {DOM} from 'react'
import {onlyUpdateForKey} from 'compose'
import {Element} from 'compose'
import styles from './Table.css'

export default onlyUpdateForKey('children')(
    Element({
        name: 'Cell',
        component: DOM.td,
        styles,
    })
)
