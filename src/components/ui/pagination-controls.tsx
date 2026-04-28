import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  label?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  label = 'items',
}: PaginationControlsProps) {
  if (totalPages <= 0) return null;

  return (
    <div className="flex items-center justify-between border-t px-4 py-3">
      <p className="text-sm text-muted-foreground">
        Mostrando {currentPage * pageSize + 1}-
        {Math.min((currentPage + 1) * pageSize, totalItems)} de {totalItems} {label}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-xs"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'ghost'}
            size="icon-xs"
            onClick={() => onPageChange(page)}
          >
            {page + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon-xs"
          disabled={currentPage === totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
