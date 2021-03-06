import React, {PropTypes} from 'react'
import Day from './Day'
import addDays from 'date-fns/add_days'

DaySet.propTypes = {
	start: PropTypes.instanceOf(Date).isRequired,
    forecast: PropTypes.object,
}

export default function DaySet({forecast, start}) {
	const dates = [0, 1, 2, 3].map(increment => addDays(start, increment))

	return (
		<div>
			{dates.map((date, index) => (
                <Day {...{date, index, forecast, key: index}} />
            ))}
		</div>
	)
}
