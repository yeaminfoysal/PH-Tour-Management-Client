import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddTourTypeModal } from "@/modules/admin/TourType/AddTourTypeModal";
import { useGetTourTypesQuery, useRemoveTourTypeMutation } from "@/redux/features/tour/tour.api"
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

export default function AddTourType() {
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 5

    const { data } = useGetTourTypesQuery({ page: currentPage, limit });
    const [removeTourType] = useRemoveTourTypeMutation()

    const totalPage = data?.meta?.totalPage || 1;

    const totalPagesArray = Array.from({ length: totalPage }, (_, index) => index + 1)

    const handleRemoveTourType = async (id: string) => {
        const toastId = toast.loading("Remooving.....")
        try {
            await removeTourType(id)
            toast.success("Removed", { id: toastId })

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-5">
            <div className="flex justify-between my-8">
                <h1 className="text-xl font-semibold">Tour Types</h1>
                <AddTourTypeModal />
            </div>
            <div className="border border-muted rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Name</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.data.map((item: { name: string, _id: string }) => (
                            <TableRow key={item._id}>
                                <TableCell className="font-medium w-full">
                                    {item?.name}
                                </TableCell>
                                <TableCell>
                                    <DeleteConfirmation
                                        onConfirm={() => handleRemoveTourType(item._id)}>
                                        <Button size="sm">
                                            <Trash2 />
                                        </Button>
                                    </DeleteConfirmation>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                                className={
                                    currentPage === 1
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                }
                            />
                        </PaginationItem>
                        {totalPagesArray.map(
                            (page) => (
                                <PaginationItem
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    <PaginationLink isActive={currentPage === page}>
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        )}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                className={
                                    currentPage === totalPage
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}
