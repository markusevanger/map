import {ComposableMap, Geographies, Geography} from "react-simple-maps";
import mapdata from "../resources/mapdata"
import {Country} from "../App"

export default function Map(props: {
    countries: Country[],
    updateIsHovered: (index: number, state: boolean) => void,
    randomCountry: Country
    children: JSX.Element
}) {

    const {countries, updateIsHovered, randomCountry, children} = props;


    const mapHeight = window.innerHeight
    const mapWidth = window.innerWidth

    return <>
        <ComposableMap
            projection="geoAzimuthalEqualArea"
            projectionConfig={{
                rotate: [-10.0, -53.0, 0],
                scale: 1300,
            }}

            width={mapWidth}
            height={mapHeight}

        >

                <Geographies geography={mapdata.data}>
                    {({geographies}) => {


                        return geographies.map((geo) => {

                                const countryIndex = countries.findIndex(country => country.id === geo.properties.cartodb_id)
                                const country = countries[countryIndex]

                                return <Geography
                                    key={geo.rsmKey}
                                    geography={geo}

                                    onMouseEnter={() => updateIsHovered(countryIndex, true)}
                                    onMouseLeave={() => updateIsHovered(countryIndex, false)}

                                    className={`${country.isHovered && !country.isSolved ? "fill-accent" : country.isSolved ? "fill-purple-950" : country.name === randomCountry.name ? "fill-purple-500" : "fill-primary-foreground"
                                    }`}

                                    tabIndex={-1}

                                    style={{
                                        default: {
                                            outline: 'none'
                                        },
                                        hover: {
                                            outline: 'none'
                                        },
                                    }}>
                                </Geography>
                            }
                        )
                    }
                    }


                </Geographies>
        </ComposableMap>
        {children}
    </>
}
