import React, {PropTypes} from 'react'
import SocialItem from './SocialItem'
import {SocialItem as Item} from 'components/social'

Follow.propTypes = {
    urls: PropTypes.arrayOf(PropTypes.string),
    text: PropTypes.string,
}

const URLS = [
    'https://www.facebook.com/avalanchecanada',
    'https://twitter.com/avalancheca',
    'http://instagram.com/avalanchecanada'
]

export default function Follow({label = 'Follow us', urls = URLS}) {
    const title = name => `${label} on ${name}`

    return (
        <SocialItem label={label}>
            {urls.map(url =>
                <Item key={url} link={url} title={title} />
            )}
        </SocialItem>
    )
}
