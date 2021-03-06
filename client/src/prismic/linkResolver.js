export const PATHS = new Map([
    ['static-page', new Map([
        ['mountain-information-network-faq', '/mountain-information-network/faq'],
        ['mountain-information-network-submission-guidelines', '/mountain-information-network/submission-guidelines'],
    ])],
])

export default function linkResolver({document, type, uid}, isBroken) {
    if (isBroken) {
        console.error('Broken link to document', document)
        return null
    }

    if (PATHS.has(type) && PATHS.get(type).has(uid)) {
        return PATHS.get(type).get(uid)
    }
}
