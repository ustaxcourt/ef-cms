import { Button } from '@web-client/ustc-ui/Button/Button';
import React from 'react';

export const Paginator = ({
  currentPageIndex,
  onPageChange,
  totalPages,
}: {
  totalPages: number;
  currentPageIndex: number;
  onPageChange: (currentPage: string) => void;
}) => {
  let currentPage = currentPageIndex + 1;

  return (
    <nav
      aria-label="Pagination"
      className="usa-pagination margin-bottom-0 margin-top-0"
      role="navigation"
    >
      <ul className="usa-pagination__list">
        {currentPage > 1 && (
          <li className="usa-pagination__item">
            <Button
              link
              aria-label="Previous"
              className="usa-pagination__link usa-pagination__previous-page cursor-pointer"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 2)}
            >
              Previous
            </Button>
          </li>
        )}
        <li
          className={'usa-pagination__item usa-pagination__page-no'}
          key={currentPage}
        >
          <button
            aria-current="page"
            aria-label={`Page ${currentPage} is you current page`}
            className="usa-pagination__button cursor-pointer paginator-current"
          >
            {currentPage}
          </button>
        </li>
        {currentPage < totalPages && (
          <li className="usa-pagination__item">
            <Button
              link
              aria-label="Next"
              className="usa-pagination__link usa-pagination__next-page cursor-pointer"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage)}
            >
              Next
            </Button>
          </li>
        )}
      </ul>
    </nav>
  );
};

Paginator.displayName = 'Paginator';
