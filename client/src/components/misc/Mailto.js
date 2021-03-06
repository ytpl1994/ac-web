import React, {PropTypes, DOM} from 'react'
import {compose, defaultProps, withProps, mapProps, setDisplayName, setPropTypes} from 'recompose'
import Url from 'url'
import {AVALANCHECANADA} from 'constants/emails'
import {clean} from 'utils/object'

export default compose(
    setDisplayName('Mailto'),
    setPropTypes({
        email: PropTypes.string,
        title: PropTypes.string,
        subject: PropTypes.string,
        cc: PropTypes.string,
        bcc: PropTypes.string,
        body: PropTypes.string,
    }),
    defaultProps({
        email: AVALANCHECANADA,
        title: 'Email Avalanche Canada',
    }),
    mapProps(({email, subject, cc, bcc, body, title, children, ...rest}) => {
        return {
            ...rest,
            title,
            children: children || email,
            href: Url.format({
                protocol: 'mailto',
                pathname: email,
                query: clean({
                    subject,
                    cc,
                    bcc,
                    body
                }),
            }),
        }
    })
)(DOM.a)
