import React, {Component, PropTypes} from 'react'

export default class Source extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['vector', 'raster', 'geojson', 'image', 'video']),
        data: PropTypes.shape({
            type: PropTypes.string.isRequired,
            features: PropTypes.array.isRequired,
        }),
        url: PropTypes.string,
        coordinates: PropTypes.array,
    }
    static defaultProps = {
        type: 'geojson'
    }
    static contextTypes = {
        map: PropTypes.object.isRequired,
    }
    get map() {
        return this.context.map
    }
    get id() {
        return this.props.id
    }
    remove() {
        this.map.removeSource(this.id)
    }
    componentDidMount() {
        const {map, props} = this
        const {id, ...source} = props

        if (map.getSource(id)) {
            map.removeSource(id)
        }

        map.addSource(id, source)
    }
    componentWillUnmount() {
        this.remove()
    }
    componentWillReceiveProps(nextProps) {
        const {type, data, id} = nextProps

        if (type === 'geojson') {
            if (data.features !== this.props.data.features) {
                const source = this.map.getSource(id)

                if (source) {
                    source.setData(data)
                }
            }
        }
    }
    shouldComponentUpdate() {
        return false
    }
    render() {
        return null
    }
}
