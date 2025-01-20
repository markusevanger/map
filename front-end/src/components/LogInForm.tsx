
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {User} from "@/components/Leaderboard.tsx";
import UserForm from "@/components/UserForm.tsx";
import {addTimeToUser} from "@/components/SharingMenu.tsx";


export default function LoginForm(
    props: {
        users: User[],
        hideDrawer: () => void
        time: string
        setUserToLoggedIn : (userName: string) => void
    }) {


    const {time, users, hideDrawer, setUserToLoggedIn} = props
    console.log(users.map(user => user.name))

    const formSchema = z.object({
        name: z.string().min(2).max(50).refine((val) => users.map(user => user.name.toLowerCase()).includes(val.toLowerCase()), {message: "Not a registered user"}),
        pin: z.string()
            .min(4, {
                message: "Please type 4 numbers"
                // TODO: fix this giant security issue by moving pins to other collection and using async calls
            }).max(4).refine((val) => users.map(user => user.pin).includes(val), {message: "Wrong pin."}),
    })


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            pin: ""
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const userId = users.filter(user => user.pin === values.pin).filter(user => user.name == values.name)[0]._id
            setUserToLoggedIn(values.name)
            addTimeToUser(userId, time)
            hideDrawer();

        } catch (error) {
            console.error("Error adding time:", error);
        }
    }



    return (
        <UserForm form={form} onSubmit={onSubmit}></UserForm>
    )
}