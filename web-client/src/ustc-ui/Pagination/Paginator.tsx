import { Button } from '@web-client/ustc-ui/Button/Button';
import React from 'react';
import classNames from 'classnames';

export const Paginator = ({
  currentPageIndex,
  onPageChange,
  totalPages,
}: {
  totalPages: number;
  currentPageIndex: number;
  onPageChange: (currentPage: number) => void;
}) => {
  let currentPage = currentPageIndex + 1;

  const nextDisabled = currentPage >= totalPages;
  const previousDisabled = currentPage <= 1;

  return (
    <nav
      aria-label="Pagination"
      className="usa-pagination margin-bottom-0 margin-top-0"
      role="navigation"
    >
      <ul className="usa-pagination__list">
        <li className="usa-pagination__item">
          <Button
            link
            aria-disabled={previousDisabled}
            aria-label="Previous"
            className={classNames(
              `${previousDisabled && 'hide'}`,
              'usa-pagination__link usa-pagination__previous-page cursor-pointer',
            )}
            disabled={previousDisabled}
            tabIndex={previousDisabled ? '-1' : '0'}
            onClick={() => onPageChange(currentPage - 2)}
          >
            Previous
          </Button>
        </li>

        <li
          className={'usa-pagination__item usa-pagination__page-no'}
          key={currentPage}
        >
          <button
            aria-current="page"
            aria-label={`Page ${currentPage} is your current page`}
            className="usa-pagination__button cursor-pointer paginator-current"
          >
            {currentPage}
          </button>
        </li>
        <li className="usa-pagination__item">
          <Button
            link
            aria-label="Next"
            className={classNames(
              `${nextDisabled && 'hide'}`,
              'usa-pagination__link usa-pagination__next-page cursor-pointer',
            )}
            disabled={nextDisabled}
            tabIndex={nextDisabled ? '-1' : '0'}
            onClick={() => onPageChange(currentPage)}
          >
            Next
          </Button>
        </li>
      </ul>
    </nav>
  );
};

Paginator.displayName = 'Paginator';
