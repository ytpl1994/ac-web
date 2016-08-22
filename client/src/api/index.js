import * as SCHEMAS from 'api/schemas'
import Axios, {defaults} from 'axios'
import {baseURL} from 'api/config.json'
import {transformHotZoneAreas, transformForecastRegions} from './transformers'
import Url from 'url'

const {
    ForecastRegion,
    HotZoneArea,
    Forecast,
    HotZoneReport,
    MountainInformationNetworkObservation,
    Incident,
} = SCHEMAS

const CONFIGS = new Map([
    [ForecastRegion, {
        transformResponse: defaults.transformResponse.concat(transformForecastRegions)
    }],
    [HotZoneArea, {
        transformResponse: defaults.transformResponse.concat(transformHotZoneAreas)
    }]
])

// TODO: Update endpoint for HotZoneArea when available
const ENDPOINTS = new Map([
    [ForecastRegion, params => 'forecasts'],
    [Forecast, params => `forecasts/${params.name}.json`],
    [HotZoneArea, params => `forecasts`],
    [HotZoneReport, params => `hzr/submissions?client=web`],
    [MountainInformationNetworkObservation, params => `min/observations?client=web&last=${params.days}:days`],
    [Incident, params => `incidents`],
])

const api = Axios.create({
    baseURL
})

export function fetch(schema, params) {
    const config = CONFIGS.get(schema)
    const endpoint = ENDPOINTS.get(schema)(params)

    return api.get(endpoint, config)
}
