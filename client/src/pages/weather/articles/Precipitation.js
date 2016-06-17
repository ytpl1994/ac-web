import React from 'react'
import {Tab, TabSet} from 'components/tab'
import {Article} from 'components/page'
import TutorialTab from './TutorialTab'
import Loop from 'components/weather/Loop'
import Image from 'components/weather/Image'

export default function Precipitation() {
    return (
        <Article title='Precipitation'>
            <TabSet>
                <Tab title='1h (HR)'>
                    <Loop type='AC_HRDPS_BC-LAM_1hr-precip' />
                </Tab>
                <Tab title='1h BC (HR)'>
                    <Loop type='AC_HRDPS_BC_wms-1hr-precip' />
                </Tab>
                <Tab title='Type (R)'>
                    <Image src='http://avalanche.ca/assets/images/weather/precipitation-precip_type.png' />
                </Tab>
                <TutorialTab uid='precipitation' />
            </TabSet>
        </Article>
    )
}
