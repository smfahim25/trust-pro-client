import React from "react";
import { useNavigate } from "react-router-dom";

const Pagination = (props) => {
  const navigate = useNavigate();
  const { page, totalPages, setPage } = props;
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const getPageNumbers = () => {
    const totalPagesArray = [];
    const maxPageButtons = 5;

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        totalPagesArray.push(i);
      }
    } else {
      let startPage = Math.max(1, page - Math.floor(maxPageButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

      if (endPage - startPage + 1 < maxPageButtons) {
        startPage = endPage - maxPageButtons + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        totalPagesArray.push(i);
      }
    }

    return totalPagesArray;
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
    navigate(`?page=${pageNumber}`);
  };
  return (
    <div className="flex justify-end mt-4">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        onClick={handlePreviousPage}
      >
        Previous
      </button>
      {getPageNumbers().map((pageNumber) => (
        <button
          key={pageNumber}
          className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ml-2 ${
            pageNumber === page ? "bg-blue-600" : ""
          }`}
          onClick={() => handlePageClick(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ml-2"
        onClick={handleNextPage}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
