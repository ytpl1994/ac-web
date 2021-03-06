import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import {ItemSet, Item} from 'components/sponsor'
import {getDocumentsOfType} from 'getters/prismic'
import transform from 'prismic/transformers'

function parse(document) {
    const {image229, name, url} = transform(document)

    return {
        title: name,
        src : image229,
        url,
    }
}
const getSponsors = createSelector(
    state => getDocumentsOfType(state, 'sponsor'),
    (state, props) => props.content.map(slice => slice.sponsor.id),
    function computeSponsors(documents, ids) {
        if (documents.isEmpty()) {
            return {}
        }

        return {
            sponsors: ids.map(id => documents.get(id)).filter(Boolean).map(parse)
        }
    }
)

function SponsorSet({sponsors = []}) {
    return (
        <ItemSet>
            {sponsors.map((sponsor, index) =>
                <Item key={index} {...sponsor} />
            )}
        </ItemSet>
    )
}

export default connect(getSponsors)(SponsorSet)
