import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp.tsx";
import {DrawerFooter} from "@/components/ui/drawer.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Send} from "lucide-react";
import {UseFormReturn} from "react-hook-form";

export default function UserForm(props: {
    form: UseFormReturn<{ name: string, pin: string }, any, undefined>,
    onSubmit: (values: any) => void
}) {


    const {form, onSubmit} = props

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <>
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Markus" {...field} />

                                </FormControl>
                                <FormMessage/>
                            </FormItem>

                        </>
                    )}
                />

                <FormField
                    control={form.control}
                    name="pin"
                    render={({field}) => (
                        <>
                            <FormItem>
                                <FormLabel>PIN</FormLabel>
                                <InputOTP maxLength={4} {...field}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0}/>
                                        <InputOTPSlot index={1}/>
                                        <InputOTPSlot index={2}/>
                                        <InputOTPSlot index={3}/>
                                    </InputOTPGroup>
                                </InputOTP>
                                <FormMessage/>
                            </FormItem>
                        </>
                    )}
                />

                <DrawerFooter>
                    <Button type="submit">Submit your time <Send></Send></Button>
                </DrawerFooter>
            </form>
        </Form>
    )
}