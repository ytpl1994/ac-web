import React, {PropTypes, createElement} from 'react'
import {compose} from 'recompose'
import {onlyUpdateForKey} from 'compose'
import memoize from 'lodash/memoize'
import CSSModules from 'react-css-modules'
import * as Icons from 'components/icons'
import styles from './Social.css'
import {FACEBOOK, TWITTER, INSTAGRAM, VIMEO, GOOGLE_PLUS} from './Providers'

const PROVIDER_REGEXES = new Map([
    [FACEBOOK, /facebook.com/],
    [TWITTER, /twitter.com/],
    [INSTAGRAM, /instagram.com/],
    [VIMEO, /vimeo.com/],
    [GOOGLE_PLUS, /plus.google.com/],
])
const PROVIDER_NAMES = new Map([
    [FACEBOOK, 'Facebook'],
    [TWITTER, 'Twitter'],
    [INSTAGRAM, 'Instagram'],
    [VIMEO, 'Vimeo'],
    [GOOGLE_PLUS, 'Google Plus'],
])
const PROVIDER_ICONS = new Map([
    [FACEBOOK, createElement(Icons.Facebook)],
    [TWITTER, createElement(Icons.Twitter)],
    [INSTAGRAM, createElement(Icons.Instagram)],
    [VIMEO, createElement(Icons.Vimeo)],
    [GOOGLE_PLUS, createElement(Icons.GooglePlus)],
])

const getProvider = memoize(url => {
    for (const [provider, regex] of PROVIDER_REGEXES) {
        if (regex.test(url)) {
            return provider
        }
    }
})

Item.propTypes = {
    link: PropTypes.string.isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    children: PropTypes.node,
}

function Item({link, title, children, style}) {
    const provider = getProvider(link)
    const name = PROVIDER_NAMES.get(provider)

    if (!title) {
        title = `Visit on ${name}.`
    } else if (typeof title === 'function') {
        title = title(name)
    }

    return (
        <a styleName='Item' target='_blank' href={link} title={title} style={style}>
            {PROVIDER_ICONS.get(provider)}
            {children}
        </a>
    )
}

export default compose(
    onlyUpdateForKey('link'),
    CSSModules(styles),
)(Item)
