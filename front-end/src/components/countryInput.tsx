import { Country } from "../App"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, } from "@/components/ui/form"
import { CornerDownLeft } from "lucide-react"


export const CountryInput = (props: {
    countries: Country[],
    randomCountry: Country,
    nextRandomCountry: () => void
}) => {

    const { randomCountry, nextRandomCountry, countries } = props

    const formSchema = z.object({
        country: z.string().refine((val) => val.toLowerCase() == randomCountry.name.toLowerCase(), { message: "Not the correct country" })
    })


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            country: "",
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(`✅ ${values.country} is correct`)
        nextRandomCountry()
        form.reset()
    }
    
    const getSolvedAmountOfCountries = () => countries.filter((country => country.isSolved)).length



    return (
        <div className="flex flex-col items-center">


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Country" className={"uppercase"} {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit"><CornerDownLeft /></Button>
                </form>
            </Form>

            <p>
                {
                    getSolvedAmountOfCountries() == 0 ?
                        "Not started" :
                        `${getSolvedAmountOfCountries()} / ${countries.length}`
                }
            </p>
        </div>
    )
}
