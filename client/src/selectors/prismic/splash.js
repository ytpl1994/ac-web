import {createSelector} from 'reselect'
import {getIsFetching} from 'getters/prismic'
import transform from 'prismic/transformers'
import {List} from 'immutable'

function getType(state, {type}) {
    return type
}
function getTransformedDocuments(state, {documents = []}) {
    return new List(documents.map(document => transform(document)))
}
function isFeatured(post) {
    return post.featured
}

export default createSelector(
    getType,
    getTransformedDocuments,
    getIsFetching,
    (type, documents, isFetching) => {
        const featured = documents.find(isFeatured) || documents.first()
        const list = documents.filter(document => document !== featured)
        let message = null

        if (isFetching) {
            message = `Loading latest ${type}...`
        }

        if (featured) {
            delete featured.preview
        }

        return {
            featured,
            list,
            message,
        }
    }
)
