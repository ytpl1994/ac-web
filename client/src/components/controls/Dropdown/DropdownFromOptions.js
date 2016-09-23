import React, {PropTypes} from 'react'
import {pure} from 'recompose'
import Dropdown from './Dropdown'
import DropdownOption from './DropdownOption'

DropdownFromOptions.propTypes = {
    options: PropTypes.instanceOf(Map).isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Set)]),
    placeholder: PropTypes.string,
    multiple: PropTypes.bool,
}

function DropdownFromOptions({options = new Map(), ...props}) {
    return (
        <Dropdown {...props}>
            {[...options].map(([value, text], index) => (
                <DropdownOption key={index} value={value}>
                    {text}
                </DropdownOption>
            ))}
        </Dropdown>
    )
}


export default pure(DropdownFromOptions)
