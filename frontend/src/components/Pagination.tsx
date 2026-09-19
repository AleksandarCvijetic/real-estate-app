interface PaginationProps {
  page: number; // 0-based, kao u Spring Data
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Paginacija">
      <button type="button" className="btn btn--ghost" disabled={page <= 0} onClick={() => onPageChange(page - 1)}>
        Prethodna
      </button>
      <span>
        Strana {page + 1} od {totalPages}
      </span>
      <button
        type="button"
        className="btn btn--ghost"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        Sledeća
      </button>
    </nav>
  );
}
