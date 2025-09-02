import MultipleImageUploader from "@/components/MultipleImageUploader.tsx";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useGetDivisionQuery } from "@/redux/features/division/division.api";
import { useAddTourMutation, useGetTourTypesQuery } from "@/redux/features/tour/tour.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, formatISO } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  costFrom: z.string().min(1, "Cost is required"),
  startDate: z.date({ message: "Start date is required" }),
  endDate: z.date({ message: "End date is required" }),
  departureLocation: z.string().min(1, "Departure location is required"),
  arrivalLocation: z.string().min(1, "Arrival location is required"),
  included: z.array(z.object({ value: z.string() })),
  excluded: z.array(z.object({ value: z.string() })),
  amenities: z.array(z.object({ value: z.string() })),
  tourPlan: z.array(z.object({ value: z.string() })),
  // maxGuest: z.string().min(1, "Max guest is required"),
  // minAge: z.string().min(1, "Minimum age is required"),
  division: z.string().min(1, "Division is required"),
  tourType: z.string().min(1, "Tour type is required"),
});

export default function AddTour() {
  const [images, setImages] = useState<File[]>([])
  const { data: tourTypeData, isLoading: divisionLoading } = useGetTourTypesQuery(undefined)
  const { data: divisionData } = useGetDivisionQuery(undefined)
  const [createTour] = useAddTourMutation()


  const tourTypeOptions = tourTypeData?.map((tourType: { _id: string; name: string }) => ({
    value: tourType._id,
    label: tourType.name
  })
  )
  const divisionOptions = divisionData?.map((tourType: { _id: string; name: string }) => ({
    value: tourType._id,
    label: tourType.name
  })
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      location: "",
      description: "",
      arrivalLocation: "",
      departureLocation: "",
      costFrom: "",
      included: [{ value: "" }],
      excluded: [{ value: "" }],
      amenities: [{ value: "" }],
      tourPlan: [{ value: "" }]
    },
  })


  const {
    fields: includedFields,
    append: includedAppend,
    remove: removeIncluded
  } = useFieldArray({
    control: form.control,
    name: "included"
  })

  const {
    fields: excludedFields,
    append: excludedAppend,
    remove: excludedRemove
  } = useFieldArray({
    control: form.control,
    name: "excluded"
  })

  const {
    fields: amenitiesFields,
    append: appendAmenities,
    remove: removeAmenities
  } = useFieldArray({
    control: form.control,
    name: "amenities"
  });

  const {
    fields: tourPlanFields,
    append: appendTourPlan,
    remove: removeTourPlan
  } = useFieldArray({
    control: form.control,
    name: "tourPlan"
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const toastId = toast.loading("Creating tour....");

    const tourData = {
      ...data,
      costFrom: Number(data.costFrom),
      startDate: formatISO(data.startDate),
      endDate: formatISO(data.endDate),
      included: data.included.map((item) => (item.value)),
      excluded: data.excluded.map((item) => (item.value)),
      amenities: data.amenities.map((item) => (item.value)),
      tourPlan: data.tourPlan.map((item) => (item.value)),
    }
    console.log(tourData)

    const formData = new FormData();

    formData.append("data", JSON.stringify(tourData));
    images.forEach((image) => formData.append("files", image as File));

    try {
      const res = await createTour(formData).unwrap();

      if (res.success) {
        toast.success("Tour created", { id: toastId });
        form.reset();
      } else {
        toast.error("Something went wrong", { id: toastId });
      }
    } catch (err: unknown) {
      console.error(err);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-5 mt-16" >
      <Card>
        <CardHeader>
          <CardTitle>Add New Tour</CardTitle>
          <CardDescription>Add a new tour to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costFrom"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Cost</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="departureLocation"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Departure Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="arrivalLocation"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Arrival Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="division"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Division</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={divisionLoading}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {divisionOptions?.map(
                            (division: { label: string, value: string }) => (
                              <SelectItem key={division.value} value={division.value}>
                                {division.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tourType"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Tour Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tourTypeOptions?.map(
                            (item: { label: string, value: string }) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(
                                new Date().setDate(new Date().getDate() - 1)
                              )
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(
                                new Date().setDate(new Date().getDate() - 1)
                              )
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-5 items-stretch">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="h-[205px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-12 flex-1">
                  <MultipleImageUploader onChange={setImages} />
                </div>
              </div>
              <div className="border-t border-muted w-full "></div>

              <div>
                <div className="flex justify-between">
                  <p className="font-semibold">Included</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => includedAppend({ value: "" })}
                  >
                    <Plus />
                  </Button>
                </div>
                <div className="space-y-4 mt-4">
                  {includedFields.map((item, index) => (
                    <div className="flex gap-2 items-center" key={item.id}>
                      <FormField
                        control={form.control}
                        name={`included.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        onClick={() => removeIncluded(index)}
                        variant="destructive"
                        className="!bg-red-700"
                        size="icon"
                        type="button"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <p className="font-semibold">Excluded</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => excludedAppend({ value: "" })}
                  >
                    <Plus />
                  </Button>
                </div>
                <div className="space-y-4 mt-4">
                  {excludedFields.map((item, index) => (
                    <div className="flex gap-2 items-center" key={item.id}>
                      <FormField
                        control={form.control}
                        name={`excluded.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        onClick={() => excludedRemove(index)}
                        variant="destructive"
                        className="!bg-red-700"
                        size="icon"
                        type="button"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <p className="font-semibold">Amenities</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => appendAmenities({ value: "" })}
                  >
                    <Plus />
                  </Button>
                </div>
                <div className="space-y-4 mt-4">
                  {amenitiesFields.map((item, index) => (
                    <div className="flex gap-2 items-center" key={item.id}>
                      <FormField
                        control={form.control}
                        name={`amenities.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        onClick={() => removeAmenities(index)}
                        variant="destructive"
                        className="!bg-red-700"
                        size="icon"
                        type="button"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <p className="font-semibold">Tour Plan</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => appendTourPlan({ value: "" })}
                  >
                    <Plus />
                  </Button>
                </div>
                <div className="space-y-4 mt-4">
                  {tourPlanFields.map((item, index) => (
                    <div className="flex gap-2 items-center" key={item.id}>
                      <FormField
                        control={form.control}
                        name={`tourPlan.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        onClick={() => removeTourPlan(index)}
                        variant="destructive"
                        className="!bg-red-700"
                        size="icon"
                        type="button"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div >
  )
}
