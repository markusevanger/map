import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle
} from "@/components/ui/drawer.tsx";
import { Dispatch, SetStateAction, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { User, UserProfile } from "@/components/Leaderboard.tsx";
import { apiUrl } from "../../values.ts";
import { Input } from "./ui/input.tsx";


export default function SharingMenu(props: {
    setShowSharingMenu: Dispatch<SetStateAction<boolean>>,
    showSharingMenu: boolean,
    time: string,
    users: User[],
    userProfile: string,
    setUserProfile: (newUserProfile: UserProfile) => void
}) {

    const {
        setShowSharingMenu,
        showSharingMenu,
        time,
        userProfile,
        setUserProfile,
    } = props;

    const [namefieldValue, setNameFieldValue] = useState("");


    const saveUsernameAndCloseMenu = (user: User) => {
        setUserProfile(user);
        localStorage.setItem("user", user.name);
        setShowSharingMenu(false)
    }


    return (
        <Drawer open={showSharingMenu} onOpenChange={setShowSharingMenu}>
            <DrawerContent>
                <>
                    <DrawerHeader>
                        <DrawerTitle>🎉 Result</DrawerTitle>
                        <DrawerDescription>
                            You finished the European map at <b>{time}</b>
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>


                        {
                            // WHEN USER IS LOGGED IN:
                            userProfile ? (
                                <Button onClick={() => {
                                    addTimeToUser(userProfile, time)
                                }}>Submit time</Button>
                            ) :

                                // WHEN USER IS NOT LOGGED IN:
                                (
                                    <>
                                        <Input value={namefieldValue} onChange={(e) => setNameFieldValue(e.target.value)} placeholder="Your name or alias"></Input>
                                        <Button onClick={() => saveUsernameAndCloseMenu(userProfile)}>
                                            Submit time under this name <ChevronRight />
                                        </Button>
                                    </>
                                )}
                    </DrawerFooter>
                </>

            </DrawerContent>
        </Drawer>
    );

}


export const addTimeToUser = async (userId: string, time: string) => {
    const newTime = { entries: [{ time: time }] };
    try {
        await fetch(apiUrl + `/users/add/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTime)
        })
    } catch (e) {
        console.error(e)
    }
}

