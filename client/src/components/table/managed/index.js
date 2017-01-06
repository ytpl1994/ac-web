import React, {PropTypes} from 'react'
import Immutable from 'immutable'
import {
    Table as Base,
    Row,
    Header as THead,
    HeaderCell,
    TBody,
    Cell,
} from 'components/table'

export const Column  = Immutable.Record({
    name: null,
    title: null,
    property: null,
    style: null,
}, 'Column')

Object.assign(Column, {
    create(definition) {
        return new Column(definition)
    }
})

export const Header = Immutable.Record({
    name: null,
    title: null,
    rowSpan: null,
    colSpan: null,
    style: null,
}, 'Header')

Object.assign(Header, {
    create(definition) {
        return new Header(definition)
    }
})

export const Body = Immutable.Record({
    title: null,
    featured: false,
    data: null,
})

Object.assign(Body, {
    create(definition) {
        return new Body(definition)
    }
})

function renderCell({property, name, ...props}, index) {
    // if (index === 0) {
    //     return (
    //         <HeaderCell {...props}>
    //             {typeof property === 'function' ? property(this) : this[property]}
    //         </HeaderCell>
    //     )
    // }

    return (
        <Cell key={name} {...props}>
            {typeof property === 'function' ? property(this) : this[property]}
        </Cell>
    )
}

Table.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.instanceOf(Column)).isRequired,
    headers: PropTypes.arrayOf(PropTypes.instanceOf(Header)),
    bodies: PropTypes.arrayOf(PropTypes.instanceOf(Body)),
    children: PropTypes.node,
}

const LIST = new Immutable.List()

export default function Table({
    columns = LIST,
    bodies = LIST,
    headers = columns,
    children,
    ...props
}) {
    return (
        <Base {...props}>
            <THead>
                {/* TODO Could have more than a header row. Headers cold be an Iterable of headers */}
                <Row>
                    {headers.map(({title, name, property, style}, index) => (
                        <HeaderCell key={index}  style={style}>
                            {typeof title === 'function' ? title() : title}
                        </HeaderCell>
                    ))}
                </Row>
            </THead>
            {bodies.map(({data, title, featured}) => (
                <TBody title={title} featured={featured}>
                {data.map(row => (
                    <Row key={row.id}>
                        {columns.map(renderCell, row)}
                    </Row>
                ))}
                </TBody>
            ))}
            {children}
        </Base>
    )
}