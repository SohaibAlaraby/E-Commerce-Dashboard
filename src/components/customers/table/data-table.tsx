"use client"
import { useState } from "react"
//icons
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

import { 
    useTable, 
    type ColumnDef, 
    type ColumnFiltersState,
    type ColumnVisibilityState,
    type RowData, 
    type SortingState, 
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { features, type DataTableFeatures } from "./data-table-features"

//pagination ,DropMenu
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

//DropMenu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
}

export function DataTable<TData extends RowData>({
  columns,
  data,
}: DataTableProps<TData>) {

  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});

  const [filter, setFilter] = useState("customerName");

  const table = useTable({
    features,
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="flex flex-col gap-5">
        <div className="flex ">
            <Input
            placeholder={`Filter ${filter==='customerName'?'customer': filter}s...`}
            value={(table.getColumn(filter)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn(filter)?.setFilterValue(event.target.value)
            }
            className="max-w-sm rounded-r-none "
            />
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" className={'rounded-l-none cursor-pointer'}>Choose Filter</Button>} />
              <DropdownMenuContent className="w-32">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Filters</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
                        <DropdownMenuRadioItem value="customerName">Customer</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="email">Email</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="location">Location</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
        </div>
        <div className="overflow-hidden rounded-md border">
        <Table>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                        )}
                    </TableHead>
                    )
                })}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        <table.FlexRender cell={cell} />
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={`hover:bg-gray-600 hover:text-white`}
        >
            <IoIosArrowBack />
            Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={`hover:bg-gray-600 hover:text-white`}
        >
          Next
          <IoIosArrowForward />
        </Button>
      </div>
    </div>
  )
}