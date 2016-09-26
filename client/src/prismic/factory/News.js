import PARSER from '../parser'

export function fromDocument(document, parser = PARSER) {
    if (!document) {
        return null
    }

    const data = parser.parse(document)
    const {date, tags} = data

    return {
        ...data,
        featured: tags.includes('featured'),
        year: date.getFullYear(),
        month: date.getMonth(),
    }
}