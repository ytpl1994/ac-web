import React, {PropTypes} from 'react'
import {compose, lifecycle, withProps} from 'recompose'
import {connect} from 'react-redux'
import getLayers from 'selectors/menu'
import {toggleLayer, changeFilter} from 'actions/drawers'
import {Header, Content} from 'components/page/drawer'
import {LayerSet, Layer, FilterSet} from 'components/page/drawer/layers'
import * as LAYERS from 'constants/map/layers'
import {loadData} from 'actions/map'
import {
    Forecast,
    HotZoneReport,
    MountainConditionReport,
    Meteogram,
    MountainInformationNetwork,
    SurfaceHoar,
    WeatherStation,
} from 'components/icons'

const {
    FORECASTS,
    HOT_ZONE_REPORTS,
    MOUNTAIN_CONDITION_REPORTS,
    METEOGRAMS,
    MOUNTAIN_INFORMATION_NETWORK,
    SURFACE_HOAR,
    WEATHER_STATION,
} = LAYERS

const ICONS = new Map([
    [FORECASTS, <Forecast />],
    [HOT_ZONE_REPORTS, <HotZoneReport />],
    [MOUNTAIN_CONDITION_REPORTS, <MountainConditionReport />],
    [METEOGRAMS, <Meteogram />],
    [MOUNTAIN_INFORMATION_NETWORK, <MountainInformationNetwork />],
    [SURFACE_HOAR, <SurfaceHoar />],
    [WEATHER_STATION, <WeatherStation />],
])

Menu.propTypes = {
    layers: PropTypes.object.isRequired,
}

function Menu({sets = [], toggleLayer, changeFilter}) {
    return (
        <Content>
            {sets.map(({title, layers}) => {
                return (
                    <LayerSet title={title}>
                        {layers
                            .map(layer => layer.toObject())
                            .map(({filters, ...layer}, type) => {
                                const handleFilterChange = changeFilter.bind(null, type)
                                const props = {
                                    key: type,
                                    icon: ICONS.get(type),
                                    onClick: event => toggleLayer(type),
                                }

                                return (
                                    <Layer {...props} {...layer}>
                                        {filters && <FilterSet filters={filters} onChange={handleFilterChange} />}
                                    </Layer>
                                )
                            })
                        }
                    </LayerSet>
                )
            })}
        </Content>
    )
}

export default compose(
    connect(getLayers, {
        toggleLayer,
        changeFilter,
        loadData,
    }),
    withProps(({layers}) => {
        const sets = layers.groupBy(layer => layer.type).map((layers, title) => {
            return {
                title,
                layers,
            }
        })

        return {
            sets,
        }
    }),
    lifecycle({
        componentDidUpdate() {
            this.props.loadData()
        }
    })
)(Menu)