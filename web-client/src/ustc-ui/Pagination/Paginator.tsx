import React from 'react';
import ReactPaginate from 'react-paginate';

export const Paginator = ({
  breakClassName,
  forcePage,
  id,
  marginPagesDisplayed = 3,
  onPageChange,
  pageCount,
  pageRangeDisplayed,
}: {
  breakClassName?: string;
  marginPagesDisplayed?: number;
  pageCount: number;
  id?: string;
  pageRangeDisplayed: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  forcePage: number;
}) => {
  return (
    <>
      <nav
        aria-label="Pagination"
        className="usa-pagination margin-bottom-0"
        id={id}
      >
        <ReactPaginate
          activeLinkClassName="paginator-current"
          breakClassName={`usa-pagination__item ${breakClassName}`}
          breakLinkClassName="usa-pagination__button cursor-pointer border-none"
          className="usa-pagination__list"
          disabledClassName="hide"
          forcePage={forcePage}
          marginPagesDisplayed={marginPagesDisplayed}
          nextClassName="usa-pagination__item usa-pagination__arrow"
          nextLinkClassName="usa-pagination__link usa-pagination__next-page cursor-pointer"
          pageClassName="usa-pagination__item usa-pagination__page-no"
          pageCount={pageCount}
          pageLinkClassName="usa-pagination__button cursor-pointer"
          pageRangeDisplayed={pageRangeDisplayed}
          previousClassName="usa-pagination__item usa-pagination__arrow"
          previousLinkClassName="usa-pagination__link usa-pagination__previous-page cursor-pointer"
          renderOnZeroPageCount={null}
          onPageChange={onPageChange}
        />
      </nav>
    </>
  );
};

Paginator.displayName = 'Paginator';
