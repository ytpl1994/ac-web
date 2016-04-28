import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { Sidebar, Item } from '../../components/sidebar'

export default function WeatherSidebar({ links, onPathChange }) {
    return (
        <Sidebar>
            {[...links].map(([key, {label}]) => (
                <Item>
                    <Link href='#' onClick={event => {
                            event.preventDefault()
                            onPathChange(key)
                        }} >
                        {label}
                    </Link>
                </Item>
            ))}
        </Sidebar>
    )
}