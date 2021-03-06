import React from 'react'
import {Point, VictoryLabel, VictoryLine, VictoryBar, VictoryChart, VictoryScatter, VictoryAxis, VictoryContainer, VictoryTooltip} from 'victory'
import {formatHours, formatForUnit, scatterEvents} from '../utils'
import {toCompass} from 'utils/degrees'
import moment from 'moment'
import theme from './theme'
import range from 'lodash/range'

const STYLE = {
    gust: {
        scatter: {
            data: {
                stroke: 'orange',
                fill: 'white',
                strokeWidth: 2,
            }
        },
        line: {
            data: {
                stroke: 'orange',
            },
        },
    },
    avg: {
        scatter: {
            data: {
                stroke: 'black',
                fill: 'white',
                strokeWidth: 2,
            }
        },
        line: {
            data: {
                stroke: 'black',
            },
        },
    },
    arrow: {
        textAnchor: 'middle',
        stroke: 'black',
        strokeWidth: 2,
        pointerEvents: 'none',
    },
    axis: {
        axisLabel: {
            padding: 35
        }
    },
}

function Arrow({x, y, datum, events, style, ...rest}) {
    return (
        <g {...events} transform={`translate(${x}, ${y}) rotate(${datum.windDirAvg})`}>
            <text dy={3} style={STYLE.arrow}>↓</text>
        </g>
    )
}

const ARROW = <Arrow />

function getSpeedAndDirectionLabels({x, windSpeedAvg, windDirAvg, utcOffset}) {
    return `${windSpeedAvg} km/h\n${windDirAvg} ° (${toCompass(windDirAvg)})\n${moment(x).utcOffset(utcOffset).format('dddd, MMMM D, HH[h]')}`
}

function getLabels({x, y, utcOffset}) {
    return `${y} km/h\n${moment(x).utcOffset(utcOffset).format('dddd, MMMM D, HH[h]')}`
}

function computeDomain(data) {
    const max = Math.max(
        ...data.map(m => Math.max(m.windSpeedAvg, m.windSpeedGust))
    )

    return [0, Math.max(Math.ceil(max / 25) * 25, 100)]
}

export default function Wind({data, min, max, width, height}) {
    const container = <VictoryContainer title='Wind speed and direction' desc={`Wind speed in kilometre per hour (km/h) and direction in degree (°) every hour from ${min} to ${max}.`} />
    const withCompass = width > 475
    const domain = computeDomain(data)

    return (
        <VictoryChart width={width} height={height} theme={theme} containerComponent={container} domainPadding={{x: 25}}>
            <VictoryAxis scale='time' tickFormat={formatHours} />
            <VictoryAxis dependentAxis scale='linear' domain={domain} tickValues={range(domain[0], ++domain[1], 25)} label='Speed (km/h)' style={STYLE.axis} />
            <VictoryLine data={data} x='measurementDateTime' y='windSpeedAvg' style={STYLE.avg.line} label='Average' labelComponent={<VictoryLabel dx={withCompass ? 5 : undefined} />} />
            <VictoryScatter data={data} x='measurementDateTime' y='windSpeedAvg' style={STYLE.avg.scatter} labels={getSpeedAndDirectionLabels} events={scatterEvents} dataComponent={<Point size={withCompass ? 10 : undefined} />} labelComponent={<VictoryTooltip />} />
            {withCompass &&
                <VictoryScatter data={data} x='measurementDateTime' y='windSpeedAvg' dataComponent={ARROW} />
            }
            <VictoryLine data={data} x='measurementDateTime' y='windSpeedGust' style={STYLE.gust.line} label='Gust' />
            <VictoryScatter data={data} x='measurementDateTime' y='windSpeedGust' labels={getLabels} labelComponent={<VictoryTooltip />} events={scatterEvents} style={STYLE.gust.scatter} />
        </VictoryChart>
    )
}
