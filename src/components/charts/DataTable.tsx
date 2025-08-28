import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Search, SlidersHorizontal, Download } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  description?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  pagination?: boolean;
  pageSize?: number;
  footer?: React.ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
  emptyMessage?: string;
  exportData?: boolean;
  exportFilename?: string;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  description,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchKeys,
  pagination = false,
  pageSize = 10,
  footer,
  onRowClick,
  className,
  emptyMessage = 'No data available',
  exportData = false,
  exportFilename = 'data-export',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Filter data based on search term
  const filteredData = searchable && searchTerm
    ? data.filter(item => {
        const keysToSearch = searchKeys || Object.keys(item);
        return keysToSearch.some(key => {
          const value = item[key as keyof T];
          return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
      })
    : data;

  // Sort data if sort config is set
  const sortedData = sortConfig
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];
        
        if (aValue === bValue) return 0;
        
        const comparison = aValue < bValue ? -1 : 1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      })
    : filteredData;

  // Paginate data if pagination is enabled
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const totalPages = pagination ? Math.ceil(sortedData.length / pageSize) : 1;

  // Handle sorting
  const handleSort = (key: keyof T | string) => {
    if (!columns.find(col => col.accessorKey === key)?.sortable) return;
    
    setSortConfig(prevConfig => {
      if (prevConfig?.key === key) {
        return prevConfig.direction === 'asc'
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  // Handle export
  const handleExport = () => {
    if (!exportData) return;
    
    // Convert data to CSV
    const headers = columns.map(col => col.header).join(',');
    const rows = sortedData.map(row => 
      columns.map(col => {
        const key = col.accessorKey;
        const value = typeof key === 'string' ? row[key as keyof T] : '';
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',')
    ).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${exportFilename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render cell content
  const renderCell = (row: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(row);
    }
    
    const key = column.accessorKey;
    const value = typeof key === 'string' ? row[key as keyof T] : null;
    
    return value !== null ? String(value) : '';
  };

  return (
    <Card className={className}>
      {(title || description || searchable || exportData) && (
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            <div className="flex items-center gap-2">
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={searchPlaceholder}
                    className="pl-8 w-[200px] md:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                  />
                </div>
              )}
              {exportData && (
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead
                    key={index}
                    className={column.sortable ? 'cursor-pointer select-none' : ''}
                    onClick={() => column.sortable && handleSort(column.accessorKey)}
                  >
                    <div className="flex items-center">
                      {column.header}
                      {column.sortable && sortConfig?.key === column.accessorKey && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex} className={column.className}>
                        {renderCell(row, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {(pagination && totalPages > 1) || footer ? (
        <CardFooter className="flex items-center justify-between py-4">
          {pagination && totalPages > 1 ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Badge variant="secondary">
                Page {currentPage} of {totalPages}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          ) : (
            <div />
          )}
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
}

export default DataTable;