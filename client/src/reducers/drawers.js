import {handleActions} from 'redux-actions'
import {combineReducers} from 'redux'
import {
    MENU_OPENED,
    MENU_CLOSED,
    LAYER_TOGGLED,
    FILTER_CHANGED,
    LAYER_TURNED_ON,
} from 'actions/drawers'
import {
    FORECASTS,
    HOT_ZONE_REPORTS,
    MOUNTAIN_INFORMATION_NETWORK,
    WEATHER_STATION,
    TOYOTA_TRUCK_REPORTS,
} from 'constants/map/layers'

function setOpen(state, open) {
    return {
        ...state,
        open
    }
}

function toggleLayer(state, name) {
    const {layers} = state

    if (layers.has(name)) {
        layers.delete(name)
    } else {
        layers.add(name)
    }

    return {
        ...state,
        layers: new Set([...layers]),
    }
}

function turnOnLayer(state, name) {
    const {layers} = state

    if (layers.has(name)) {
        return state
    }

    layers.add(name)

    return {
        ...state,
        layers: new Set([...layers]),
    }
}

function changeFilter({filters, ...rest}, {layer, name, value}) {
    let filter = filters.get(layer).get(name)

    if (typeof value === 'object') {
        filter = {
            ...filter,
            ...value,
        }
    } else {
        filter = {
            ...filter,
            value,
        }
    }

    filters.get(layer).set(name, filter)

    return {
        ...rest,
        filters: new Map([...filters])
    }
}

const MENU = {
    open: false,
    // Defines the default active layers, could comes from localStorage as well or sessionStorage or cookies
    layers: new Set([FORECASTS, HOT_ZONE_REPORTS, MOUNTAIN_INFORMATION_NETWORK, WEATHER_STATION, TOYOTA_TRUCK_REPORTS]),
    // Defines the default filters, could comes from localStorage as well
    filters: new Map([
        [MOUNTAIN_INFORMATION_NETWORK, new Map([
            ['days', {
                type: 'listOfValues',
                value: '7',
                options: new Map([
                    ['1', '1 day'],
                    ['3', '3 days'],
                    ['7', '7 days'],
                    ['14', '14 days'],
                    ['30', '30 days'],
            ])}],
            ['type', {
                type: 'listOfValues',
                value: 'all',
                options: new Map([
                    ['all', 'Show all report types'],
                    ['quick', 'Quick'],
                    ['avalanche', 'Avalanche'],
                    ['snowpack', 'Snowpack'],
                    ['weather', 'Weather'],
                    ['incident', 'Incident'],
            ])}],
        ])]
    ]),
}

export default combineReducers({
    menu: handleActions({
        [MENU_OPENED]: state => setOpen(state, true),
        [MENU_CLOSED]: state => setOpen(state, false),
        [LAYER_TOGGLED]: (state, {payload}) => toggleLayer(state, payload),
        [LAYER_TURNED_ON]: (state, {payload}) => turnOnLayer(state, payload),
        [FILTER_CHANGED]: (state, {payload}) => changeFilter(state, payload),
    }, MENU),
})
