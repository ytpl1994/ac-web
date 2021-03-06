import React, {PropTypes} from 'react'
import {toClass} from 'recompose'
import {Link} from 'react-router'
import {Navbar, Header, Container as DrawerContainer, Body, Close} from 'components/page/drawer'
import Forecast, {Metadata} from 'components/forecast'
import {Muted, Error, SPAW} from 'components/misc'
import {forecast} from 'containers/connectors'
import Sponsor from 'containers/Sponsor'
import {LocateAsClass} from 'components/button/Locate'
import {Wrapper} from 'components/tooltip'
import {Feed} from 'containers/feed'

const LOCATE_STYLE = {
    padding: '0.15em'
}
const ARROW_STYLE = {
    left: 'calc(50% + 7px)'
}

Container.propTypes = {
    type: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    forecast: PropTypes.object,
    region: PropTypes.object,
}

function Container({
    isLoading,
    isLoaded,
    isError,
    isUnderSpecialWarning,
    specialWarningLink,
    forecast,
    type,
    title = 'Loading...',
    link,
    onCloseClick,
    onLocateClick,
}) {
    const shareUrl = link && `${window.location.origin}${link.to}`
    const NAVBAR_STYLE = isUnderSpecialWarning ? {
        justifyContent: 'space-between'
    } : null

    return (
        <DrawerContainer>
            <Navbar style={NAVBAR_STYLE}>
                {isUnderSpecialWarning && <SPAW link={specialWarningLink} />}
                <Sponsor label={null} />
                <Close onClick={onCloseClick} />
            </Navbar>
            <Header subject='Avalanche Forecast'>
                <h1>
                    {link ? <Link {...link}>{title}</Link> : title}
                    {isLoading ||
                    <Wrapper tooltip='Display on map' arrowStyle={ARROW_STYLE}>
                        <LocateAsClass onClick={onLocateClick} style={LOCATE_STYLE} />
                    </Wrapper>
                    }
                </h1>
                {forecast && <Metadata {...forecast} shareUrl={shareUrl} />}
            </Header>
            <Body>
                {isLoading && <Muted>Loading forecast...</Muted>}
                {isError &&
                    <Error>
                        Error happened while loading forecast.
                    </Error>
                }
                {(isLoaded && !forecast) && (
                    <Feed type='blog' category='north-rockies' />
                )}
                {forecast && <Forecast {...forecast} />}
            </Body>
        </DrawerContainer>
    )
}

export default forecast(Container)
