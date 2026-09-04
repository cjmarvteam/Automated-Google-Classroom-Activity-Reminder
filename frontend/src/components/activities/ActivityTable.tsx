import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity } from '../../types';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { getDueStatus, getStatusColor } from '@/lib/utils';

interface Props {
  data: Activity[];
  onRowClick: (activity: Activity) => void;
}

export function ActivityTable({ data, onRowClick }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Activity>[] = [
    {
      accessorKey: 'title',
      header: 'Activity',
      cell: ({ row }) => (
        <div className="font-medium text-foreground">{row.original.title}</div>
      ),
    },
    {
      accessorKey: 'subject',
      header: 'Subject',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.subject}</span>
      ),
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: ({ row }) => {
        const date = new Date(row.original.dueDate);
        return (
          <span className="text-muted-foreground whitespace-nowrap">
            {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = getDueStatus(row.original.dueDate, row.original.status);
        const color = getStatusColor(status);
        return <Badge className={`${color} border-0 px-2.5 py-0.5 rounded-full text-xs font-medium`}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'maxPoints',
      header: 'Max Points',
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-xs border-white/10 bg-white/5 text-muted-foreground">
          {row.original.maxPoints || '-'} pts
        </Badge>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (data.length === 0) {
    return (
      <div className="glass rounded-xl py-16 text-center border border-white/10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8d5c4]/30 text-3xl">
          📭
        </div>
        <p className="text-foreground font-medium">No activities found</p>
        <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-xl overflow-hidden border border-white/10">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-white/5 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer text-muted-foreground font-semibold text-xs uppercase tracking-wider py-3"
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' && <ChevronUp className="h-3.5 w-3.5" />}
                      {header.column.getIsSorted() === 'desc' && <ChevronDown className="h-3.5 w-3.5" />}
                      {!header.column.getIsSorted() && <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/30" />}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer transition-all duration-200 border-b border-white/5 hover:bg-[#c97a57]/5 group"
                onClick={() => onRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {data.length} activities
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-white/10 bg-white/5 hover:bg-white/10 text-foreground rounded-lg disabled:opacity-50"
          >
            Previous
          </Button>
          <span className="text-sm font-medium text-foreground">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-white/10 bg-white/5 hover:bg-white/10 text-foreground rounded-lg disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}