import React from 'react'
import {Link} from 'react-router'
import {Error} from 'components/misc'
import t from 'tcomb-form/lib'
import {QUICK, WEATHER, SNOWPACK, AVALANCHE, INCIDENT} from 'constants/min'

function handleNumberInputWheel(event) {
    if (document.activeElement === event.currentTarget) {
        event.preventDefault()
    }
}

const ASPECT_FIELDS = {
    N: {
        label: 'N',
    },
    NE: {
        label: 'NE',
    },
    E: {
        label: 'E',
    },
    SE: {
        label: 'SE',
    },
    S: {
        label: 'S',
    },
    SW: {
        label: 'SW',
    },
    W: {
        label: 'W',
    },
    NW: {
        label: 'NW',
    },
}

export default {
    required: {
        // error: <Error>Some values are missing</Error>,
        label: 'Step 1. Required Information',
        fields: {
            title: {
                label: 'Name your report',
                attrs: {
                    placeholder: 'e.g. Upper Raft River',
                },
            },
            datetime: {
                type: 'datetime-local',
                label: 'When were you in the field?',
                attrs: {
                    placeholder: 'Select a date/time',
                },
            },
            latlng: {
                label: 'Location',
                help: 'Click on the map to place the pin or drag the pin on the map or enter longitude/latitude in fields below.',
                fields: {
                    longitude: {
                        error: 'Enter a number between -180° and 180°',
                        attrs: {
                            placeholder: 'e.g. -118.18',
                        }
                    },
                    latitude: {
                        error: 'Enter a number between -90° and 90°',
                        attrs: {
                            placeholder: 'e.g. 50.98',
                        }
                    },
                }
            },
        },
    },
    uploads: {
        label: 'Step 2. Uploads',
        help: 'A photo help to tell your story.',
        fields: {
            files: {
                label: 'Click to upload a photo',
                help: 'If uploading more than one photo, select all and submit photos together.',
                type: 'file',
                attrs: {
                    multiple: true,
                    accept: 'image/jpeg,image/jpg,image/png',
                },
            }
        },
    },
    [QUICK]: {
        help: 'Use the Quick Report to quickly share information about your trip. You can create a comprehensive report by adding more details in the Avalanche, Snowpack, Weather, and/or Incident tabs.',
        fields: {
            ridingConditions: {
                fields: {
                    ridingQuality: {
                        factory: t.form.Radio,
                        label: 'Riding quality was (optional):',
                    },
                    weather: {
                        label: 'The day was (optional):',
                    },
                    snowConditions: {
                        label: 'Snow conditions were (optional):',
                    },
                    stayedAway: {
                        label: 'We stayed away from (optional):',
                    },
                    rideType: {
                        label: 'We rode (optional):',
                    },
                }
            },
            avalancheConditions: {
                fields: {
                    slab: {
                        label: 'Slab avalanches today or yesterday.',
                    },
                    sound: {
                        label: 'Whumpfing or drum-like sounds or shooting cracks.',
                    },
                    snow: {
                        label: '30cm + of new snow, or significant drifting, or rain in the last 48 hours.',
                    },
                    temp: {
                        label: 'Rapid temperature rise to near zero degrees or wet surface snow.',
                    }
                }
            },
            comment: {
                type: 'textarea'
            }
        }
    },
    [WEATHER]: {
        help: 'Key data includes information about current and accumulated precipitation, wind speed and direction, temperatures, and cloud cover.',
        fields: {
            temperatureTrend: {
                factory: t.form.Radio,
                label: 'Describe how the temperature changed in the last 3 hours. (optional)',
            },
            snowfallRate: {
                label: 'Snowfall rate (cm/hour) (optional)',
                help: 'If there was no snow, please leave this field blank.',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Number between 0 and 100',
                    min: 0,
                    max: 100,
                },
            },
            rainfallRate: {
                factory: t.form.Radio,
                help: 'If there was no rain, please leave this field blank.',
            },
            newSnow24Hours: {
                label: 'Amount of new snow in last 24 hours (cm) (optional)',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Number between 0 and 100',
                    min: 0,
                    max: 100,
                },
            },
            precipitation24Hours: {
                label: 'Total rain and snow combined in last 24 hours (mm) (optional)',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Number between 0 and 100',
                    min: 0,
                    max: 100,
                },
            },
            stormSnowAmount: {
                label: 'Total snow from the most recent storm (cm) (optional)',
                help: 'Please enter the amount of snow that has fallen during the current storm cycle. You can specify a storm start date to describe the time period over which this snow fell.',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Number between 0 and 300',
                    min: 0,
                    max: 300,
                },
            },
            stormStartDate: {
                type: 'date',
                help: 'The date on which the most recent storm started. Leave blank if there has not been a recent storm.',
                attrs: {
                    placeholder: 'Click to select a date'
                },
            },
            temperature: {
                label: 'Temperature at time of observation (deg C) (optional)',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Number between -50 and 40',
                    min: -50,
                    max: 40,
                },
            },
            minTemp: {
                label: 'Minimum temperature in last 24 hours (deg C) (optional)',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Number between -50 and 30',
                    min: -50,
                    max: 30,
                },
            },
            maxTemp: {
                label: 'Maximum temperature in last 24 hours (deg C) (optional)',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Number between -40 and 40',
                    min: -40,
                    max: 40,
                },
            },
            windDirection: {
                fields: ASPECT_FIELDS,
            },
            blowingSnow: {
                factory: t.form.Radio,
                help: 'How much snow is blowing at ridge crest elevation. Light: localized snow drifting. Moderate: a plume of snow is visible. Intense: a large plume moving snow well down the slope.',
            },
            skyCondition: {
                factory: t.form.Radio,
                label: 'Cloud cover (optional)',
                help: 'Values expressed in eighths refer to the proportion of the sky that was covered with clouds. E.g. 2/8 refers to a sky approximately one quarter covered with cloud.',
            },
            precipitationType: {
                factory: t.form.Radio,
            },
            windSpeed: {
                factory: t.form.Radio,
                help: 'Calm: smoke rises. Light: flags and twigs move. Moderate: snow begins to drift. Strong: whole tress in motion. Extreme: difficulty walking.',
            },
            weatherObsComment: {
                label: 'Weather observation comment (optional)',
                type: 'textarea'
            },
        }
    },
    [SNOWPACK]: {
        help: 'Snowpack depth, layering, and bonding are key data. Test results are very useful.',
        fields: {
            snowpackObsType: {
                label: 'Is this a point observation or a summary of your day? (optional)',
                factory: t.form.Radio,
            },
            snowpackSiteElevation: {
                label: 'Elevation (m) above sea level (optional)',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Metres above sea level'
                },
            },
            snowpackSiteElevationBand: {
                label: 'Elevation band (optional)',
            },
            snowpackSiteAspect: {
                label: 'Aspect (optional)',
                fields: ASPECT_FIELDS,
            },
            snowpackDepth: {
                label: 'Snowpack depth (cm) (optional)',
                help: 'Total height of snow in centimetres. Averaged if this is a summary.',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Number between 0 and 10000',
                    min: 0,
                    max: 10000,
                },
            },
            snowpackWhumpfingObserved: {
                label: 'Did you observe whumpfing? (optional)',
                help: 'A whumpf is a rapid settlement of the snowpack caused by the collapse of a weak layer. It is accompanied by an audible noise.',
            },
            snowpackCrackingObserved: {
                label: 'Did you observe cracking? (optional)',
                help: 'Cracking is shooting cracks radiating more than a couple of metres from your sled or skis.',
            },
            snowpackSurfaceCondition: {
                label: 'Surface condition (optional)',
            },
            snowpackFootPenetration: {
                label: 'Foot penetration (cm) (optional)',
                help: 'How far you sink into the snow when standing on one fully-weighted foot',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Number between 0 and 100',
                    min: 0,
                    max: 100,
                },
            },
            snowpackSkiPenetration: {
                label: 'Ski penetration (cm) (optional)',
                help: 'How far you sink into the snow when standing on one fully-weighted ski.',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Number between 0 and 200',
                    min: 0,
                    max: 200,
                },
            },
            snowpackSledPenetration: {
                label: 'Sled penetration (cm) (optional)',
                help: 'The depth a sled sinks into the snow after stopping slowly on level terrain.',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Number between 0 and 200',
                    min: 0,
                    max: 200,
                },
            },
            snowpackTestInitiation: {
                factory: t.form.Radio,
                label: 'Snowpack test result (optional)',
                help: 'Average if you did a number of tests.',
            },
            snowpackTestFracture: {
                factory: t.form.Radio,
                label: 'Snowpack test fracture character (optional)',
                help: 'Average if you did a number of tests. Describe further in comments if variable results.',
            },
            snowpackTestFailure: {
                label: 'Snowpack test failure depth (optional)',
                help: 'Depth below the surface that failure occurred.',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Number between 0 and 200',
                    min: 0,
                    max: 200,
                },
            },
            snowpackObsComment: {
                type: 'textarea',
                label: 'Observation comment (optional)',
                help: 'Please add additional information about the snowpack, especially notes about weak layer, how the snow varied by aspect/elevation, and details of any slope testing performed.',
            }
        }
    },
    [AVALANCHE]: {
        help: 'Share information about a single, notable avalanche or tell us about overall avalanche conditions by describing many avalanches in a general sense. Aspect, elevation, trigger, dimensions/size are key data.',
        fields: {
            avalancheOccurrence: {
                type: 'datetime-local',
                label: 'Avalanche date/time',
                help: 'If you triggered or witnessed an avalanche add date/time.',
                attrs: {
                    placeholder: 'Select a date/time',
                },
            },
            avalancheObservation: {
                factory: t.form.Radio,
                help: 'If you observed evidence of recent avalanches, estimate occurrence time.',
            },
            avalancheNumber: {
                factory: t.form.Radio,
                label: 'Number of avalanches in this report (optional)',
            },
            avalancheSize: {
                factory: t.form.Radio,
                help: 'Use Canadian size classification. Size 1 is relatively harmless to people. Size 2 can bury, injure or kill a person. Size 3 can bury and destroy a car. Size 4 can destroy a railway car. Size 5 can destroy 40 hectares of forest.',
            },
            slabThickness: {
                label: 'Slab thickness (cm) (optional)',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Number between 10 and 500',
                    min: 10,
                    max: 500,
                },
            },
            slabWidth: {
                label: 'Slab width (m) (optional)',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Number between 1 and 3000',
                    min: 1,
                    max: 3000,
                },
            },
            runLength: {
                label: 'Run length (m) (optional)',
                help: 'Length from crown to toe of debris.',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Number between 1 and 10000',
                    min: 1,
                    max: 10000,
                },
            },
            triggerType: {
                factory: t.form.Radio,
            },
            triggerSubtype: {
                factory: t.form.Radio,
                help: 'A remote trigger is when the avalanche starts some distance away from where the trigger was applied.',
            },
            triggerDistance: {
                label: 'Remote trigger distance (m) (optional)',
                help: 'If a remote trigger, enter how far from the trigger point is the nearest part of the crown.',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Number between 0 and 2000',
                    min: 0,
                    max: 2000,
                },
            },
            startZoneAspect: {
                fields: ASPECT_FIELDS
            },
            startZoneElevation: {
                label: 'Start zone elevation (m) (optional)',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Number between 0 and 5000',
                    min: 0,
                    max: 5000,
                },
            },
            startZoneIncline: {
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Number between 0 and 90',
                    min: 0,
                    max: 90,
                },
            },
            runoutZoneElevation: {
                help: 'The lowest point of the debris.',
                type: 'number',
                attrs: {
                    onWheel: handleNumberInputWheel,
                    placeholder: 'Metres above sea level',
                },
            },
            weakLayerBurialDate: {
                type: 'date',
                help: 'Date the weak layer was buried.',
                attrs: {
                    placeholder: 'Click to select date'
                },
            },
            windExposure: {
                factory: t.form.Radio,
            },
            vegetationCover: {
                factory: t.form.Radio,
            },
            avalancheObsComment: {
                type: 'textarea',
                help: 'Please add additional information, for example terrain, aspect, elevation etc. especially if describing many avalanches together.',
            }
        }
    },
    [INCIDENT]: {
        help: (
            <span>
                Sharing incidents can help us all learn. Describe close calls and accidents here. Be sensitive to the privacy of others. Before reporting serious accidents check our <Link to='/mountain-information-network/submission-guidelines' target='_blank'>submission guidelines</Link>.
            </span>
        ),
        fields: {
            groupActivity: {
                factory: t.form.Radio,
                label: 'Activity (optional)',
                help: 'If other, please describe it below.',
            },
            groupDetails: {
                fields: {
                    groupSize: {
                        label: 'Total in the group? (optional)',
                        type: 'number',
                        attrs: {
                            onWheel: handleNumberInputWheel,
                            placeholder: 'Number between 0 and 100',
                            min: 0,
                            max: 100,
                        }
                    },
                    numberFullyBuried: {
                        label: 'People fully buried? (optional)',
                        type: 'number',
                        attrs: {
                            onWheel: handleNumberInputWheel,
                            placeholder: 'Number between 0 and 100',
                            min: 0,
                            max: 100,
                        }
                    },
                    numberPartlyBuriedImpairedBreathing: {
                        label: 'People partly buried with impaired breathing? (optional)',
                        type: 'number',
                        attrs: {
                            onWheel: handleNumberInputWheel,
                            placeholder: 'Number between 0 and 100',
                            min: 0,
                            max: 100,
                        }
                    },
                    numberPartlyBuriedAbleBreathing: {
                        label: 'People partly buried with normal breathing? (optional)',
                        type: 'number',
                        attrs: {
                            onWheel: handleNumberInputWheel,
                            placeholder: 'Number between 0 and 100',
                            min: 0,
                            max: 100,
                        }
                    },
                    numberCaughtOnly: {
                        label: 'People injured (caught but not buried)? (optional)',
                        type: 'number',
                        attrs: {
                            onWheel: handleNumberInputWheel,
                            placeholder: 'Number between 0 and 100',
                            min: 0,
                            max: 100,
                        }
                    },
                    numberPeopleInjured: {
                        label: 'People not injured (caught but not buried)? (optional)',
                        type: 'number',
                        attrs: {
                            onWheel: handleNumberInputWheel,
                            placeholder: 'Number between 0 and 400',
                            min: 0,
                            max: 400,
                        }
                    }
                }
            },
            terrainTrap: {
                help: 'Terrain traps are features that increase the consequences of an avalanche.',
            },
            otherActivityDescription: {
                attrs: {
                    placeholder: 'Describe other activity',
                },
            },
            terrainShapeTriggerPoint: {
                factory: t.form.Radio,
                label: 'Terrain shape at trigger point (optional)',
                help: 'Convex: a roll. Concave: bowl-shaped. Planar: smooth with no significant convexities or concavities. Unsupported: a slope that drops off abruptly at the bottom.',
            },
            snowDepthTriggerPoint: {
                factory: t.form.Radio,
                label: 'Snow depth at trigger point (optional)',
                help: 'The depth of the snowpack compared to the average conditions in the area. Shallow: shallower than average. Deep: deeper than average. Average: about the same as everywhere else. Variable: depth varies significantly in the place where the avalanche started.',
            },
            incidentDescription: {
                type: 'textarea',
                help: (
                    <span>
                        No names and no judging please. See <Link to='/mountain-information-network/submission-guidelines' target='_blank'>submission guidelines</Link> for more details.
                    </span>
                ),
            },
            numberInvolved: {
                type: 'hidden'
            },
        },
    },
}
