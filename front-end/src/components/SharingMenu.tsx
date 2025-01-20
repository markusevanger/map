import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle
} from "@/components/ui/drawer.tsx";
import {Dispatch, SetStateAction} from "react";
import {ChevronRight} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {User, UserProfile} from "@/components/Leaderboard.tsx";
import LoginForm from "./LogInForm";
import {apiUrl} from "../../values.ts";
import ProfileForm from "./ProfileForm.tsx";


export default function SharingMenu(props: {
    setShowSharingMenu: Dispatch<SetStateAction<boolean>>,
    showSharingMenu: boolean,
    time: string,
    users: User[],
    userProfile: UserProfile,
    setUserProfile: (newUserProfile: UserProfile) => void
    sharingMenuState: "result" | "chooseLoginOrRegister" | "newUser" | "signIn"
    setSharingMenuState: (newState: "result" | "chooseLoginOrRegister" | "newUser" | "signIn") => void
}) {

    const {
        setShowSharingMenu,
        showSharingMenu,
        time,
        users,
        userProfile,
        setUserProfile,
        sharingMenuState,
        setSharingMenuState
    } = props;


    const setUserToLoggedIn = (userName:string) => {
        setUserProfile(userName);
        localStorage.setItem("user", userName);
    }


    return (
        <Drawer open={showSharingMenu} onOpenChange={setShowSharingMenu}>
            <DrawerContent>

                {
                    // DISPLAYED WHEN GAME IS FINISHED
                    sharingMenuState === "result" && (
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
                                                addTimeToUser()
                                            }}>Submit time</Button>
                                        ) :

                                        // WHEN USER IS NOT LOGGED IN:
                                        (
                                            <>
                                                <Button onClick={() => setSharingMenuState("newUser")}>
                                                    Submit as new user <ChevronRight/>
                                                </Button>
                                                <Button variant="outline" onClick={() => setSharingMenuState("signIn")}>
                                                    Already a user
                                                </Button>
                                            </>
                                        )}
                            </DrawerFooter>
                        </>
                    )}


                {
                    // DISPLAYED WHEN USER PRESSES "SUBMIT AS NEW USER"
                    sharingMenuState === "newUser" && (
                    <>
                        <DrawerHeader>
                            <DrawerTitle>Create a user ID</DrawerTitle>
                            <DrawerDescription>
                                To submit your time, you need to register a name and a pin code to identify yourself.
                            </DrawerDescription>
                        </DrawerHeader>

                        <ProfileForm
                            time={time}
                            users={users}
                            hideDrawer={() => setShowSharingMenu(false)}
                        />
                    </>
                )}

                {
                    // DISPLAYED WHEN USER PRESSES "ALREADY A USER" OR SIGN IN FROM LEADERBOARD.
                    sharingMenuState === "signIn" && (
                    <>
                        <DrawerHeader>
                            <DrawerTitle>Log in</DrawerTitle>
                            <DrawerDescription>
                                To submit your time, you need to log in with your existing name and pin code.
                            </DrawerDescription>
                        </DrawerHeader>
                        <LoginForm
                            time={time}
                            users={users}
                            hideDrawer={() => setShowSharingMenu(false)}
                            setUserToLoggedIn={setUserToLoggedIn}
                        />
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );

}


export const addTimeToUser = async (userId: string, time: string) => {
    const newTime = {entries: [{time: time}]};
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

