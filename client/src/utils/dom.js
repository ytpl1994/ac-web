export function scrollPosition(hash) {
    const element = document.querySelector(`a[href="${hash}"]`)

    if (!element) {
        return null
    }

    const {top} = element.parentElement.getBoundingClientRect()
    const {pageYOffset} = window
    const {pathname} = document.location
    let offset = 15

    switch (pathname) {
        case '/ambassadors':
            offset = 45
            break;
    }

    return [0, Math.floor(top + pageYOffset) - 75 - offset]
}
