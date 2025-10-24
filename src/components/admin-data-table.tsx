"use client"

import { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2
} from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  onView?: (row: TData) => void
  onEdit?: (row: TData) => void
  onDelete?: (row: TData) => void
}

export function AdminDataTable<TData, TValue>({
  columns,
  data,
  searchKey = "title",
  onView,
  onEdit,
  onDelete,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  // Add actions column if any action handlers are provided
  const columnsWithActions = useMemo(() => {
    if (!onView && !onEdit && !onDelete) return columns

    const actionsColumn: ColumnDef<TData, TValue> = {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0"
              aria-label={`Actions for ${(row.original as any)?.title || 'item'}`}
              title="Open actions menu"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" role="menu" aria-label="Row actions">
            {onView && (
              <DropdownMenuItem 
                onClick={() => onView(row.original)}
                role="menuitem"
                aria-label={`View details for ৳{(row.original as any)?.title || 'item'}`}
              >
                <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
                View
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem 
                onClick={() => onEdit(row.original)}
                role="menuitem"
                aria-label={`Edit ${(row.original as any)?.title || 'item'}`}
              >
                <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem 
                onClick={() => onDelete(row.original)}
                className="text-destructive"
                role="menuitem"
                aria-label={`Delete ${(row.original as any)?.title || 'item'}`}
              >
                <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }

    return [...columns, actionsColumn]
  }, [columns, onView, onEdit, onDelete])

  const table = useReactTable({
    data,
    columns: columnsWithActions,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-10"
            aria-label="Search table data"
            role="searchbox"
          />
        </div>
        <div className="flex items-center space-x-2" role="toolbar" aria-label="Table actions">
          <Button variant="outline" size="sm" aria-label="Open filter options">
            <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
            Filter
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table role="table" aria-label="Data table">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} role="row">
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id} 
                      className="whitespace-nowrap font-medium"
                      role="columnheader"
                      aria-sort={
                        header.column.getIsSorted() === "asc" ? "ascending" :
                        header.column.getIsSorted() === "desc" ? "descending" :
                        header.column.getCanSort() ? "none" : undefined
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "flex items-center space-x-2 cursor-pointer select-none hover:text-foreground"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              header.column.getToggleSortingHandler()?.(e)
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                          role={header.column.getCanSort() ? "button" : undefined}
                          aria-label={
                            header.column.getCanSort() 
                              ? `Sort by ${header.column.columnDef.header}${
                                  header.column.getIsSorted() === "asc" ? " descending" :
                                  header.column.getIsSorted() === "desc" ? " ascending" :
                                  ""
                                }`
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                  role="row"
                  aria-rowindex={index + 2} // +2 because header is row 1
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id} 
                      className="whitespace-nowrap"
                      role="cell"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow role="row">
                <TableCell 
                  colSpan={columns.length} 
                  className="h-24 text-center"
                  role="cell"
                  aria-label="No data available"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="text-sm text-muted-foreground" aria-live="polite">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} entries
        </div>
        <nav className="flex items-center space-x-2" role="navigation" aria-label="Table pagination">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
              .filter((page) => {
                const current = table.getState().pagination.pageIndex + 1
                return page === 1 || page === table.getPageCount() || Math.abs(page - current) <= 1
              })
              .map((page, index, array) => (
                <div key={page} className="flex items-center">
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2 text-muted-foreground" aria-hidden="true">...</span>
                  )}
                  <Button
                    variant={
                      page === table.getState().pagination.pageIndex + 1
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => table.setPageIndex(page - 1)}
                    className="h-8 w-8 p-0"
                    aria-label={`Go to page ${page}`}
                    aria-current={page === table.getState().pagination.pageIndex + 1 ? "page" : undefined}
                  >
                    {page}
                  </Button>
                </div>
              ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Go to next page"
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </nav>
      </div>
    </div>
  )
}

// Helper function to create sortable header
export function createSortableHeader(title: string) {
  return ({ column }: { column: any }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto p-0 font-semibold hover:bg-transparent"
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
}

// Helper function to create status badge
export function createStatusBadge(status: string) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    available: "default",
    sold: "secondary",
    pending: "outline",
    completed: "default",
    cancelled: "destructive",
  }

  return (
    <Badge variant={variants[status] || "outline"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}