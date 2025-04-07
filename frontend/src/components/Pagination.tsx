interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  return (
    <div
      className="flex items-center justify-center mt-4"
      style={{ gap: "0.5rem" }}
    >
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          disabled={currentPage === i + 1}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>

      <label style={{ marginLeft: "1rem" }}>
        Results per page:{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
    </div>
  );
};

export default Pagination;
