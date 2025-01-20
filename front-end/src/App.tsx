import { useEffect, useRef, useState } from "react";
import mapdata from "./resources/mapdata"
import { CountryInput } from "./components/countryInput"
import Map from "./components/map"
import { Button } from "@/components/ui/button.tsx";
import Leaderboard, { User } from "@/components/Leaderboard.tsx";
import SharingMenu from "@/components/SharingMenu.tsx";
import { apiUrl } from "../values.ts";
import ToggleDarkModeButton from "@/components/ToggleDarkModeButton.tsx";


function getRandomIndex(length: number): number {
    return Math.floor(Math.random() * length)
}


function App() {


    const [users, setUsers] = useState<User[]>([]);
    const [userName, setUserName] = useState("");
    const [countries, setCountries] = useState<Country[]>([])
    const [randomCountry, setRandomCountry] = useState<Country>()
    const [showSharingMenu, setShowSharingMenu] = useState<boolean>(true)
    const [startTime, setStartTime] = useState<Date>()
    const [endTime, setEndTime] = useState<Date>()
    const myRef = useRef(null)

    // Load in users and userName
    useEffect(() => {

        setUserName(localStorage.getItem("user") || "");
        async function getUsers() {
            try {
                const response = await fetch(apiUrl + "/users/");
                if (!response.ok) {
                    console.error(`An error occurred: ${response.statusText}`);
                }
                const res = await response.json();

                setUsers(res); // Update the state with fetched users
                console.log(users);

            } catch (error) {
                console.error("Error fetching users:", error); // Handle errors
            }
        }

        getUsers();
        return
    }, []);

    // Load in map data and set random country.
    useEffect(() => {
        const allCountries: Country[] = mapdata.data.features.map((feature) =>
            new Country(feature.properties.name, feature.properties.cartodb_id, new Geometry(feature.geometry.type, feature.geometry.coordinates))
        );
        setCountries(allCountries)

        const nextCountry = allCountries[getRandomIndex(allCountries.length)]
        setRandomCountry(nextCountry)
        console.log(allCountries.length + " countries loaded in.");

    }, []);


    const updateRandomCountry = () => {
        const remainingCountries = countries.filter((country) => !country.isSolved)

        // First time
        if (remainingCountries.length + 1 == countries.length) {
            const startTime = new Date()
            setStartTime(startTime)
            console.log(`Set start time to: ${startTime.getHours() + ":" + startTime.getMinutes() + ":" + startTime.getSeconds()}`)
        }

        // Not finished
        if (remainingCountries.length > 0) {
            const nextCountry = remainingCountries[getRandomIndex(remainingCountries.length)]
            setRandomCountry(nextCountry)
            console.log(`random country: ${nextCountry.name}.`)
        }

        // Finished
        else {
            handleShowResult()
        }
    }


    const setCountryToSolved = (index: number) => {
        setCountries((prevCountries) => {
            const newCountries = [...prevCountries];
            const country = newCountries[index]
            country.isSolved = !country.isSolved;
            return newCountries;
        })
    };

    const updateIsHovered = (index: number, state: boolean) => {
        setCountries((prevCountries) => {
            const newCountries = [...prevCountries];
            const country = newCountries[index]
            country.isHovered = state;
            return newCountries;
        })
    };


    const handleShowResult = () => {
        const endTime = new Date()
        console.log(`Set start time to: ${endTime.getHours() + ":" + endTime.getMinutes() + ":" + endTime.getSeconds()}`)
        setEndTime(endTime)
        setShowSharingMenu(true)
    }

    const nextRandomCountry = () => {
        const oldCountryIndex = countries.findIndex((country) => country == randomCountry)
        setCountryToSolved(oldCountryIndex)
        updateRandomCountry()
    }
    const getStartEndTimeDifferenceFormatted = () => {

        if (endTime && startTime) {
            const timeDiffSeconds = (endTime.getTime() - startTime.getTime()) / 1000;

            const minutes = Math.floor(timeDiffSeconds / 60);
            const seconds = Math.floor(timeDiffSeconds % 60);

            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return "Couldn't calculate time"


    }


    return (
        <>
            <div className="min-h-screen bg-background">

                <SharingMenu
                    showSharingMenu={showSharingMenu}
                    setShowSharingMenu={setShowSharingMenu}
                    time={getStartEndTimeDifferenceFormatted()}
                    users={users}
                    setUserProfile={(newUserName) => setUserName(newUserName.name)}
                    userProfile={userName}>
                </SharingMenu>


                <div className={""}>
                    <section>
                        {
                            randomCountry && (
                                < Map
                                    countries={countries}
                                    updateIsHovered={updateIsHovered}
                                    randomCountry={randomCountry}
                                >

                                    <div
                                        className="w-full flex items-center justify-center">
                                        <CountryInput
                                            countries={countries}
                                            randomCountry={randomCountry}
                                            nextRandomCountry={nextRandomCountry}>
                                        </CountryInput>
                                    </div>
                                </Map>
                            )
                        }
                    </section>

                    <section>
                        <div ref={myRef} className={"w-100 flex flex-col p-10 gap-5"}>

                            <Leaderboard users={users} userName={userName}
                                setUserName={(newUserName: string) => setUserName(newUserName)}></Leaderboard>
                            <div className={"flex gap-5"}>
                                <ToggleDarkModeButton></ToggleDarkModeButton>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}

export default App


export class Country {
    isSolved: boolean
    name: string
    id: number
    geometry: Geometry
    isHovered: boolean

    constructor(name: string, id: number, geometry: Geometry) {
        this.isSolved = false
        this.isHovered = false

        this.name = name
        this.id = id
        this.geometry = geometry
    }
}

export class Geometry {
    type: string
    coordinates: number[][][][]

    constructor(type: string, coordinates: number[][][][]) {
        this.type = type
        this.coordinates = coordinates
    }
}
