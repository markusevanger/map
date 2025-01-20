import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {User} from "lucide-react";


export default function Leaderboard(props: { users: User[], userName:string, setUserName : (newUserName: string) => void }) {

    const {users, userName, setUserName } = props

    const flattenedEntriesSortedByTimeAscending: FlattenedEntry[] = users
        .flatMap((user) =>
            user.entries.map((entry) => ({
                user,
                entry,
            }))
        )
        .sort((a, b) => {
            const timeA = a.entry.time.split(':');
            const timeB = b.entry.time.split(':');

            const minutesA = parseInt(timeA[0], 10);
            const secondsA = parseInt(timeA[1], 10);
            const totalSecondsA = minutesA * 60 + secondsA;

            const minutesB = parseInt(timeB[0], 10);
            const secondsB = parseInt(timeB[1], 10);
            const totalSecondsB = minutesB * 60 + secondsB;

            return totalSecondsA - totalSecondsB; // Sort ascending by total seconds
        }).map((entry, newIndex) => ({
            ...entry,
            position: newIndex + 1,
        }));

    const handleLogInOrOut = () => {
        if (userName) {
            localStorage.removeItem("user")
            setUserName("")
        } else console.log("todo")
    }

    return (
        <Card className={"w-full"}>
            <CardHeader>
                <CardTitle>
                    <div className={"w-full flex justify-between"}>
                        Leaderboard
                        <DropdownMenu>
                            <DropdownMenuTrigger> <Button variant={"outline"}> <User/> {userName || "Log in"}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    onClick={handleLogInOrOut}> {userName ? "Log out" : "Log in"} </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardTitle>
                <CardDescription>These are the top times</CardDescription>
            </CardHeader>
            <CardContent>


                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="">Position</TableHead>
                            <TableHead className="">User</TableHead>
                            <TableHead className="text-right">Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {flattenedEntriesSortedByTimeAscending.map(({position, user, entry}, index) => (
                            <TableRow key={index}>
                                <TableCell className={"font-bold"}> {position} </TableCell>
                                <TableCell> {user.name}</TableCell>
                                <TableCell className={"text-right"}> {entry.time} </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}


export interface UserProfile {
    _id:string
    name: string
}

export interface User {
    _id: string;
    name: string;
    pin: string
    entries: Entry[]; // Array of entries for each user
}

export interface Entry {
    time: string; // In the format "mm:ss"
}

export interface FlattenedEntry {
    position: number;
    user: User;
    entry: Entry;
}

