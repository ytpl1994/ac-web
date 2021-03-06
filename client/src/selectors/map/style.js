import Immutable from 'immutable'
import {createSelector} from 'reselect'
import {getStyle, getActiveFeatures} from 'getters/map'
import {createGetEntitiesForSchema} from 'selectors/factories'
import {getResultsSet} from 'getters/api'
import {getDocumentsOfType} from 'getters/prismic'
import {getLayers, getLayerFilter} from 'getters/drawers'
import {ActiveLayerIds, LayerIds} from 'constants/map/layers'
import Parser, {parseLocation} from 'prismic/parser'
import {isSpecialInformationValid, isHotZoneReportValid} from 'prismic/utils'
import * as Layers from 'constants/drawers'
import * as Schemas from 'api/schemas'
import turf from '@turf/helpers'
import explode from '@turf/explode'

// Define transformers to transform entity to feature
const TRANSFORMERS = new Map([
    [Layers.MOUNTAIN_INFORMATION_NETWORK, submission => {
        submission = submission.toJSON()
        const [lat, lng] = submission.latlng
        const types = submission.obs.map(ob => ob.obtype)

        return turf.point([lng, lat], {
            id: Schemas.MountainInformationNetworkSubmission.getId(submission),
            icon: types.includes('incident') ? 'min-pin-with-incident' : 'min-pin',
            title: submission.title,
            types,
        })
    }],
    [Layers.WEATHER_STATION, station => {
        station = station.toJSON()

        return turf.point([station.longitude, station.latitude], {
            title: station.name,
            id: Schemas.WeatherStation.getId(station),
        })
    }],
    [Layers.TOYOTA_TRUCK_REPORTS, document => {
        const {uid, position, headline} = Parser.parse(document)

        return turf.point([position.longitude, position.latitude], {
            title: headline,
            id: uid,
        })
    }],
    [Layers.SPECIAL_INFORMATION, document => {
        const {uid, headline, locations} = document

        return turf.multiPoint(locations.map(parseLocation), {
            title: headline,
            id: uid,
        })
    }],
])

function getPanelIdFactory(schema) {
    return (state, props) => {
        const {panel} = props.location.query

        if (!panel) {
            return null
        }

        const [key, id] = panel.split('/')

        return schema.key === key ? id : undefined
    }
}

// Create submissions source
const getSubmissions = createSelector(
    createGetEntitiesForSchema(Schemas.MountainInformationNetworkSubmission),
    state => getResultsSet(state, Schemas.MountainInformationNetworkSubmission, {
        days: getLayerFilter(state, Layers.MOUNTAIN_INFORMATION_NETWORK, 'days')
    }),
    (submissions, {ids}) => Array.from(ids)
        .map(id => submissions.get(id))
        .filter(Boolean)
        .map(TRANSFORMERS.get(Layers.MOUNTAIN_INFORMATION_NETWORK))
)

const getSubmission = createSelector(
    createGetEntitiesForSchema(Schemas.MountainInformationNetworkSubmission),
    getPanelIdFactory(Schemas.MountainInformationNetworkSubmission),
    (submissions, id) => {
        if (submissions.has(id)) {
            const transformer = TRANSFORMERS.get(Layers.MOUNTAIN_INFORMATION_NETWORK)

            return transformer(submissions.get(id))
        }
    }
)

function prepareSubmissions(submissions, submission, typeFilter, filter) {
    submissions = submissions.filter(filter)

    if (typeFilter.size > 0) {
        function has(type) {
            return typeFilter.has(type)
        }
        function filter(submission) {
            return submission.properties.types.find(has)
        }

        submissions = submissions.filter(filter)
    }

    if (submission && filter(submission)) {
        const {id} = submission.properties
        function filter(submission) {
            return submission.properties.id === id
        }

        // We are only adding "submission" once.
        // "submission" may be already in submissions!
        const has = submissions.some(filter)

        if (!has) {
            submissions.push(submission)
        }
    }

    return submissions
}

function getSubmissionsTypeFilter(state) {
    return getLayerFilter(state, Layers.MOUNTAIN_INFORMATION_NETWORK, 'type')
}

const getIncidentSubmissionFeatures = createSelector(
    getSubmissions,
    getSubmission,
    getSubmissionsTypeFilter,
    () => {
        function filter(type) {
            return type === 'incident'
        }

        return submission => submission.properties.types.some(filter)
    },
    prepareSubmissions,
)

const getSubmissionFeatures = createSelector(
    getSubmissions,
    getSubmission,
    getSubmissionsTypeFilter,
    () => {
        function filter(type) {
            return type !== 'incident'
        }

        return submission => submission.properties.types.every(filter)
    },
    prepareSubmissions,
)

// Create weather station source
const getWeatherStationFeatures = createSelector(
    createGetEntitiesForSchema(Schemas.WeatherStation),
    stations => {
        const transformer = TRANSFORMERS.get(Layers.WEATHER_STATION)

        return stations.map(transformer).toArray()
    }
)

// Create Toyota Truck Report Features
const getToyotaTruckFeatures = createSelector(
    state => getDocumentsOfType(state, 'toyota-truck-report'),
    documents => documents.map(TRANSFORMERS.get(Layers.TOYOTA_TRUCK_REPORTS)).toArray()
)

function pointReducer(points, feature) {
    // Explode because Mapbox does not cluster on MultiPoint geometries
    // https://github.com/mapbox/mapbox-gl-js/issues/4076
    const {properties} = feature

    return points.concat(explode(feature).features.map(feature => {
        // explode does not transfer properties :(
        // https://github.com/Turfjs/turf/issues/564
        return turf.feature(feature.geometry, properties)
    }))
}

// Create Special Information Features
const getSpecialInformationFeatures = createSelector(
    state => getDocumentsOfType(state, 'special-information'),
    documents => documents.toArray()
        .map(document => Parser.parse(document))
        .filter(isSpecialInformationValid)
        .map(TRANSFORMERS.get(Layers.SPECIAL_INFORMATION))
        .reduce(pointReducer, [])
)

// All map sources
const getSourceFeatures = createSelector(
    getSubmissionFeatures,
    getIncidentSubmissionFeatures,
    getWeatherStationFeatures,
    getToyotaTruckFeatures,
    getSpecialInformationFeatures,
    (submissions, incidents, stations, toyota, special) => new Map([
        [Layers.MOUNTAIN_INFORMATION_NETWORK, submissions],
        [Layers.MOUNTAIN_INFORMATION_NETWORK_INCIDENTS, incidents],
        [Layers.WEATHER_STATION, stations],
        [Layers.TOYOTA_TRUCK_REPORTS, toyota],
        [Layers.SPECIAL_INFORMATION, special],
    ])
)

// Creating visibilities
const getLayersVisibilities = createSelector(
    state => getLayers(state),
    layers => layers.reduce((visibilities, {id, visible}) => {
        let visibility = visible ? 'visible' : 'none'

        return LayerIds.get(id).reduce(
            (visibilities, id) => visibilities.set(id, visibility),
            visibilities
        )
    }, new Map())
)

// Creating filters
const LayerToSchemaMapping = new Map([
    [Layers.FORECASTS, Schemas.ForecastRegion.key],
    [Layers.HOT_ZONE_REPORTS, Schemas.HotZone.key],
])

const getActiveFeatureFilters = createSelector(
    getActiveFeatures,
    features => {
        const filters = new Map()

        ActiveLayerIds.forEach((ids, layer) => ids.forEach(id => {
            const schema = LayerToSchemaMapping.get(layer)
            const filter = Immutable.List.of('==', 'id', '')

            if (features.has(schema)) {
                filters.set(id, filter.set(2, features.get(schema)))
            } else {
                filters.set(id, filter)
            }
        }))

        return filters
    }
)

const getHotZoneReports = createSelector(
    state => getDocumentsOfType(state, 'hotzone-report'),
    reports => reports.map(parse).filter(isHotZoneReportValid)
)

const getActiveHotZoneFilters = createSelector(
    getHotZoneReports,
    reports => {
        const ids = reports.map(report => report.region).toArray()

        return new Map([
            ['hot-zones', Immutable.List.of('!in', 'id', ...ids)],
            ['opened-hot-zones', Immutable.List.of('in', 'id', ...ids)],
        ])
    }
)

const getLayerFilters = createSelector(
    getActiveFeatureFilters,
    getActiveHotZoneFilters,
    (active, hzr) => new Map([...active, ...hzr])
)

function getLayerIndexFactory(style) {
    const ids = style.get('layers').map(layer => layer.get('id'))

    return id => ids.findIndex(value => value === id)
}

const parse = Parser.parse.bind(Parser)

export default createSelector(
    getStyle,
    getLayerFilters,
    getLayersVisibilities,
    getSourceFeatures,
    (style, filters, visibilities, features) => {
        if (!style || !Immutable.Iterable.isIterable(style) || !style.has('id')) {
            return null
        }

        const getLayerIndex = getLayerIndexFactory(style)

        return style.withMutations(style => {
            // Set filters
            filters.forEach((filter, layer) => {
                const path = ['layers', getLayerIndex(layer), 'filter']

                style.setIn(path, filter)
            })

            // Set source features
            features.forEach((features, name) => {
                style.setIn(['sources', name, 'data', 'features'], features)
            })

            // Set layer visibility
            visibilities.forEach((visibility, layer) => {
                const path = ['layers', getLayerIndex(layer), 'layout', 'visibility']

                style.setIn(path, visibility)
            })
        })
    }
)
