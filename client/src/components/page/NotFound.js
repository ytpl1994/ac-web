import React, {PropTypes} from 'react'
import {Page, Content, Main, Header} from 'components/page'

NotFound.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    children: PropTypes.element,
}

export default function NotFound({
    title = 'This is an avalanche size 404 error...',
    subtitle = 'The page you are looking for has not been found.',
    children
}) {
    return (
        <Page>
            <Header title={title} />
            <Content>
                <Main>
                    <h2>{subtitle}</h2>
                    {children}
                </Main>
            </Content>
        </Page>
    )
}
