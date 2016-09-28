import React from 'react'
import {compose, withProps} from 'recompose'
import {Link} from 'react-router'
import {Sidebar, Contact, Follow, Share, Item, RSSFeed} from 'components/sidebar'
import {FORECASTERS} from 'constants/emails'

const contact = <Contact email={FORECASTERS} />
const share = <Share />
const follow = <Follow />
const weather = (
    <Item>
        <Link to='/weather'>Your daily Mountain Weather Forecast</Link>
    </Item>
)
const min = (
    <Item>
        <Link to='/mountain-information-network/submit'>Submit a Mountain Information Report</Link>
    </Item>
)
const blog = (
    <Item>
        <Link to='/blogs'>Visit our Blog</Link>
    </Item>
)

export default compose(
    withProps(() => {
        const {pathname, origin} = document.location

        return {
            children: [
                weather,
                min,
                blog,
                follow,
                share,
                contact,
                <RSSFeed url={`${origin}/api${pathname}.rss`} />,
            ]
        }
    })
)(Sidebar)
