import {apiUrl} from "../../values.ts";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {User} from "@/components/Leaderboard.tsx";
import UserForm from "@/components/UserForm.tsx";


export default function ProfileForm(
    props: {
        time: string,
        users: User[],
        hideDrawer : () => void
    }) {


    const {time, users, hideDrawer} = props
    console.log(users.map(user => user))

    const formSchema = z.object({
        name: z.string().min(2).max(50).refine((val) => !users.map(user => user.name.toLowerCase()).includes(val.toLowerCase()), {message: "User already exists"}),
        pin: z.string()
            .min(4, {
                message: "Please type 4 numbers"
            }).max(4),
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
        addNewUser(values.name, values.pin).then( () => {
            localStorage.setItem("user", values.name)
            hideDrawer()
        })

    }

    const addNewUser = async (name: string, pin: string) => {
        const newUser = {
            name: name,
            pin: pin,
            entries: [
                {
                    time: time,
                }
            ]
        }
        try {
            await fetch(apiUrl + "/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            })
        } catch (e) {
            console.error(e)
        }
    }


    return (
       <UserForm onSubmit={onSubmit} form={form}></UserForm>
    )
}