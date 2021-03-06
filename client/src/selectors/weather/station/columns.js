import moment from 'moment'
import {toCompass} from 'utils/degrees'

export const Hour = {
    name: 'hour',
    title: 'Hour',
    property({measurementDateTime, utcOffset}) {
        return moment(measurementDateTime).utcOffset(utcOffset).format('HH[h]')
    },
}

export const SnowHeight = {
    name: 'snowHeight',
    title: 'Height',
    property({snowHeight}) {
        return Math.round(snowHeight)
    },
    style: {
        minWidth: 65
    }
}

export const NewSnow = {
    name: 'newSnow',
    title: 'New',
    property: 'newSnow',
    style: {
        minWidth: 65
    }
}

export const AirTemperatureAvg = {
    name: 'airTempAvg',
    title: 'Air Temperature Average (°C)',
    property: 'airTempAvg',
    style: {
        minWidth: 65
    }
}

export const AirTemperatureMax = {
    name: 'airTempMax',
    title: 'Air Temperature Max (°C)',
    property: 'airTempMax',
    style: {
        minWidth: 65
    }
}

export const AirTemperatureMin = {
    name: 'airTempMin',
    title: 'Air Temperature Min (°C)',
    property: 'airTempMin',
    style: {
        minWidth: 65
    }
}

export const WindSpeedAvg = {
    name: 'windSpeedAvg',
    title: 'Wind Speed Average (km/h)',
    property({windSpeedAvg}) {
        return Math.round(windSpeedAvg * 10) / 10
    },
    style: {
        minWidth: 65
    }
}

export const WindDirectionAvg = {
    name: 'windDirAvg',
    title: 'Wind Direction Average',
    property({windDirAvg}) {
        return `${windDirAvg} ° (${toCompass(windDirAvg)})`
    },
    style: {
        minWidth: 105
    }
}

export const WindSpeedGust = {
    name: 'windSpeedGust',
    title: 'Wind Speed Gust (km/h)',
    property({windSpeedGust}) {
        return Math.round(windSpeedGust * 10) / 10
    },
    style: {
        minWidth: 65
    }
}

export const RelativeHumidity = {
    name: 'relativeHumidity',
    title: 'Relative Humidity (%)',
    property({relativeHumidity}) {
        return Math.min(Math.round(relativeHumidity), 100)
    },
    style: {
        minWidth: 65
    }
}
