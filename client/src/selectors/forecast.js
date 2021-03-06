import moment from 'moment'
import {createSelector} from 'reselect'
import {Forecast, ForecastRegion} from 'api/schemas'
import {getEntitiesForSchema, getEntityForSchema} from 'getters/entities'
import {getResultsSet} from 'getters/api'
import * as Ratings from 'constants/forecast/rating'
import * as Modes from 'constants/forecast/mode'
import {computeFitBounds} from 'selectors/map/bounds'
import {getHighlight} from 'getters/prismic'
import camelCase from 'lodash/camelCase'

// TODO: Use constants server response to reduce client side transformation.
// See Maps below...

const TO_RATINGS = new Map([
    ["1:Low", Ratings.LOW],
    ["2:Moderate", Ratings.MODERATE],
    ["3:Considerable", Ratings.CONSIDERABLE],
    ["4:High", Ratings.HIGH],
    ["5:Extreme", Ratings.EXTREME],
    ["N/A:'Spring'", Ratings.NO_RATING],
    ["N/A:No Rating", Ratings.NO_RATING],
])
const TO_MODES = new Map([
    ['Off season', Modes.OFF],
    ['Summer situation', Modes.SUMMER],
    ['Spring situation', Modes.SPRING],
    ['Early season', Modes.EARLY_SEASON],
])

function transformDangerRating({date, dangerRating}) {
    const {alp, tln, btl} = dangerRating

    return {
        date: moment(date).toDate(),
        dangerRating: {
            alp: TO_RATINGS.get(alp),
            tln: TO_RATINGS.get(tln),
            btl: TO_RATINGS.get(btl),
        }
    }
}

function trim(text) {
    return typeof text === 'string' ? text.trim() : text
}

// TODO: Have the server to provide it as object instead of a string
function asConfidenceObject(confidence) {
    const [level, comment] = typeof confidence === 'string' ? confidence.split(' - ') : []

    return {
        level,
        comment,
    }
}

function transform(forecast) {
    if (!forecast.region) {
        return forecast
    }

    const {
        dangerRatings = [],
        dateIssued,
        validUntil,
        dangerMode,
        confidence,
        avalancheSummary,
        snowpackSummary,
        weatherForecast
    } = forecast

    // TODO(wnh): Clean this up and merge it into either the server side or the
    // transformDangerRating function
    const fixDangerRatingDates = function(x, n){
        let newDate = moment(dateIssued).add(n + 1, 'days')
        return Object.assign({}, x, {date: newDate.toDate()})
    }

    return {
        ...forecast,
        confidence: asConfidenceObject(confidence),
        dangerMode: TO_MODES.get(dangerMode),
        dateIssued: moment(dateIssued).toDate(),
        validUntil: moment(validUntil).toDate(),
        dangerRatings: dangerRatings.map(transformDangerRating).map(fixDangerRatingDates),
        avalancheSummary: trim(avalancheSummary),
        snowpackSummary: trim(snowpackSummary),
        weatherForecast: trim(weatherForecast),
    }
}

function getForecasts(state) {
    return getEntitiesForSchema(state, Forecast)
}

function getForecastRegion(state, {params}) {
    return getEntityForSchema(state, ForecastRegion, params.name)
}

function getForecastResultSet(state, {params}) {
    return getResultsSet(state, Forecast, params)
}

const getForecast = createSelector(
    getForecasts,
    getForecastResultSet,
    function findForecast(forecasts, {ids}) {
        const [id] = ids

        return forecasts.get(id)
    }
)

const getComputeBounds = createSelector(
    getForecastRegion,
    computeFitBounds,
    (region, computeBounds) => () => computeBounds(region)
)

export default createSelector(
    getHighlight,
    getForecast,
    getForecastRegion,
    getForecastResultSet,
    getComputeBounds,
    (highlight, forecast, forecastRegion, result, computeBounds) => {
        const {isFetching, isError, isLoaded} = result

        if (forecast) {
            forecast = transform(forecast.toJSON())
            const {externalUrl, parksUrl, region} = forecast
            let showForecast = false
            let link = null

            if (externalUrl) {
                if (externalUrl === 'http://avalanche.ca/blogs/north-rockies') {
                    link = {
                        to: '/blogs?category=north-rockies'
                    }
                } else {
                    link = {
                        target: '_blank',
                        to: externalUrl,
                    }
                }
            } else if (parksUrl) {
                link = {
                    target: '_blank',
                    to: parksUrl,
                }
            } else {
                showForecast = true
                link = {
                    to: `/forecasts/${region}`,
                }
            }

            return {
                isLoading: isFetching,
                isError,
                isLoaded,
                title: forecast.bulletinTitle || forecast.name || region.name,
                forecast: showForecast ? forecast : null,
                link,
                computeBounds,
                isUnderSpecialWarning: highlight && highlight[camelCase(region)] === 'Yes',
                specialWarningLink: highlight && highlight.link,
                specialWarningContent: highlight && highlight.description
            }
        } else {
             return {
                isLoading: isFetching,
                isError,
                isLoaded,
                title: forecastRegion && forecastRegion.getIn(['properties', name]),
                computeBounds,
            }
        }
    }
)
