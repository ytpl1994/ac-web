import React, {PropTypes, Component} from 'react'
import {compose, lifecycle, onlyUpdateForKeys, withProps, withHandlers, withState, getContext} from 'recompose'
import {List} from 'immutable'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {Map, Source, Layer, Marker} from 'components/map'
import {zoomChanged, centerChanged, loadData} from 'actions/map'
import mapStateToProps from 'selectors/map'
import {getLayerIds} from 'selectors/map/layers'
import {
    MountainInformationNetworkSubmission,
    WeatherStation,
} from 'api/schemas'
import {pushNewLocation, pushQuery} from 'utils/router'
import * as Layers from 'constants/map/layers'
import {near} from 'utils/geojson'

const EMPTY = new List()
function noop() {}

function isForecastRoute({path}) {
    return path === 'forecasts'
}
function getAllLayerIds(layers) {
    return layers.map(layer => layer.id).toArray()
}
function renderSource(source) {
    return <Source key={source.id} {...source} />
}
function renderLayer(layer) {
    return <Layer key={layer.id} {...layer} />
}

const forecastRegionsRegex = /^forecast-regions/

class Container extends Component {
    propTypes = {
        onLoad: PropTypes.func,
        onInitializationError: PropTypes.func,
    }
    static defaultProps = {
        onLoad: noop,
        onInitializationError: noop,
    }
    state = {
        bounds: null,
        map: null,
    }
    get map() {
        return this.state.map
    }
    lastMouseMoveEvent = null
    processMouseMove = () => {
        if (this.lastMouseMoveEvent === null || !this.map) {
            return
        }

        const canvas = this.map.getCanvas()
        const {point} = this.lastMouseMoveEvent
        const features = this.map.queryRenderedFeatures(point, {
            layers: getAllLayerIds(this.props.layers)
        })

        canvas.style.cursor = features.length ? 'pointer' : null

        const [feature] = features

        if (feature && feature.properties) {
            const {title, id} = feature.properties

            if (title) {
                canvas.setAttribute('title', title)
            } else {
                canvas.removeAttribute('title')
            }

            if (forecastRegionsRegex.test(feature.layer.id)) {
                this.setForecastRegionsFilter(id)
            } else {
                this.setForecastRegionsFilter()
            }
        } else {
            this.setForecastRegionsFilter()
        }

        this.lastMouseMoveEvent = null
    }
    handleMarkerClick = ({location}, event) => {
        event.stopPropagation()

        pushNewLocation(location, this.props)
    }
    handleMousemove = event => {
        if (this.map) {
            this.lastMouseMoveEvent = event
        }
    }
    handleMoveend = event => {
        // Inspired by https://www.mapbox.com/blog/mapbox-gl-js-reactive/
        if (event.originalEvent) {
            const center = event.target.getCenter().toArray()

            this.props.centerChanged(center)
        }
    }
        handleZoomend = event => {
        // Inspired by https://www.mapbox.com/blog/mapbox-gl-js-reactive/
        if (event.originalEvent) {
            const zoom = event.target.getZoom()

            this.props.zoomChanged(zoom)
        }
    }
    handleClick = event => {
        if (!this.map) {
            return
        }

        const {point} = event
        let features = null

        // Handle Mountain Information Network layers
        features = this.map.queryRenderedFeatures(point, {
            layers: getLayerIds(Layers.MOUNTAIN_INFORMATION_NETWORK)
        })

        if (features.length > 0) {
            const [feature] = features
            const key = MountainInformationNetworkSubmission.getKey()

            if (feature.properties.cluster) {
                const {properties: {point_count}} = feature
                const {data} = this.props.sources.find(({id}) => id === key)

                return this.setBounds(near(feature, data, point_count))
            } else {
                const {id} = feature.properties

                return pushQuery({
                    panel: `${key}/${id}`
                }, this.props)
            }
        }

        features = this.map.queryRenderedFeatures(point, {
            layers: getLayerIds(Layers.WEATHER_STATION)
        })

        if (features.length > 0) {
            const [feature] = features
            const key = WeatherStation.getKey()

            if (feature.properties.cluster) {
                const {properties: {point_count}} = feature
                const {data} = this.props.sources.find(({id}) => id === key)

                return this.setBounds(near(feature, data, point_count))
            } else {
                const {stationId} = feature.properties

                return pushQuery({
                    panel: `${key}/${stationId}`
                }, this.props)
            }
        }

        // Handle Hot Zone Report layers
        features = this.map.queryRenderedFeatures(point, {
            layers: getLayerIds(Layers.HOT_ZONE_REPORTS)
        })

        if (features.length > 0) {
            const [feature] = features
            const {type} = feature.geometry

            return this.setBounds(type === 'Point' ? null : feature, () => {
                pushNewLocation({
                    pathname: `/map/hot-zone-reports/${feature.properties.id}`
                }, this.props)
            })
        }

        // Handle Forecast layers
        features = this.map.queryRenderedFeatures(point, {
            layers: getLayerIds(Layers.FORECASTS)
        })

        if (features.length > 0) {
            const [feature] = features

            return this.setBounds(feature, () => {
                pushNewLocation({
                    pathname: `/map/forecasts/${feature.properties.id}`
                }, this.props)
            })
        }
    }
    handleLoad = event => {
        const map = event.target

        this.setState({map})
        this.props.onLoad(map)
    }
    setForecastRegionsFilter(id = '') {
        if (!this.map) {
            return
        }

        this.map.setFilter('forecast-regions-contour-hover', ['==', 'id', id])
    }
    setActiveForecastRegion(name = '') {
        if (!this.map) {
            return
        }

        this.map.setFilter('forecast-regions-active', ['==', 'id', name])
        this.map.setFilter('forecast-regions-contour-active', ['==', 'id', name])
    }
    setBounds(feature, callback) {
        let bounds = null

        if (feature) {
            bounds = this.props.computeFitBounds(feature, false, false)
        }

        this.setState({bounds}, callback)
    }
    componentWillMount() {
        this.setBounds(this.props.feature)
    }
    componentDidMount() {
        this.props.loadData()

        this.intervalID = setInterval(this.processMouseMove, 100)
    }
    componentWillUnmount() {
        clearInterval(this.intervalID)
    }
    shouldComponentUpdate({layers, sources, markers}, {map, bounds}) {
        const {props, state} = this

        if (layers === props.layers &&
            sources === props.sources &&
            markers === props.markers &&
            bounds === state.bounds &&
            map === state.map
        ) {
            return false
        }

        return true
    }
    componentWillReceiveProps({feature, routes}) {
        if (feature && this.props.feature !== feature) {
            this.setBounds(feature)
        }

        if (this.props.routes.find(isForecastRoute) && !routes.find(isForecastRoute)) {
            this.setActiveForecastRegion()
        }
    }
    componentDidUpdate() {
        if (this.props.routes.find(isForecastRoute)) {
            const {name} = this.props.params

            this.setActiveForecastRegion(name)
        }
    }
    renderMarker = ({id, ...marker}) => {
        return <Marker key={id} {...marker} onClick={this.handleMarkerClick} />
    }
    renderMountainInformationNetworkMarker = ({id, ...marker}) => {
        return <Marker key={id} {...marker} onClick={this.handleMountainInformationNetworkMarkerClick} />
    }
    render() {
        const {map} = this
        const {
            bounds,
        } = this.state
        const {
            sources = EMPTY,
            layers = EMPTY,
            markers = EMPTY,
            zoom,
            center,
            onInitializationError,
        } = this.props
        const events = {
            onMousemove: this.handleMousemove,
            onMoveend: this.handleMoveend,
            onZoomend: this.handleZoomend,
            onClick: this.handleClick,
            onLoad: this.handleLoad,
            onInitializationError,
        }

        return (
            <Map bounds={bounds} zoom={zoom} center={center} {...events}>
                {map && sources.map(renderSource)}
                {map && layers.map(renderLayer)}
                {map && markers.map(this.renderMarker)}
            </Map>
        )
    }
}

export default compose(
    getContext({
        location: PropTypes.object.isRequired,
        params: PropTypes.object.isRequired,
        routes: PropTypes.array.isRequired,
    }),
    withRouter,
    connect(mapStateToProps, {
        zoomChanged,
        centerChanged,
        loadData,
    }),
)(Container)
