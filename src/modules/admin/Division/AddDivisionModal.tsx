/* eslint-disable @typescript-eslint/no-explicit-any */
import SingleImageUploader from "@/components/SingleImageUploader";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddDivisionMutation } from "@/redux/features/division/division.api";
import { useState } from "react";
;
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function AddDivisionModal() {
    const form = useForm();
    const [image, setImage] = useState<File | null>(null);
    const [addDivision] = useAddDivisionMutation()
    const [open, setOpen] = useState(false)

    const onSubmit = async (data: any) => {
        const formData = new FormData();

        formData.append("data", JSON.stringify(data));
        formData.append("file", image as File);
        const toastId = toast.loading("Creating division")
        try {
            const res = await addDivision(formData).unwrap();
            console.log(res)
            toast.success("Division Added", { id: toastId });
            setOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Division</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Division</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-4" id="add-division" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="mb-2">Division Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Division Name"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="mb-2">Division Details</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Division Details"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                    <SingleImageUploader onChange={setImage} />
                </Form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button disabled={!image} type="submit" form="add-division">
                        Add
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}