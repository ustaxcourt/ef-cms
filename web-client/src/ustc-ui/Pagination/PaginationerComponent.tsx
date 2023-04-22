import React from 'react';
import ReactPaginate from 'react-paginate';

export const PaginationerComponent = ({
  onPageChange,
  pageCount,
  pageRangeDisplayed,
}: {
  pageCount: number;
  pageRangeDisplayed: number | 5;
  onPageChange: (selectedItem: { selected: number }) => void;
}) => {
  return (
    <>
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={pageRangeDisplayed}
        onPageChange={onPageChange}
      />
    </>
  );
};

PaginationerComponent.displayName = 'PaginationerComponent';
