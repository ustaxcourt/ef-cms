import React, { useState } from 'react';
import classNames from 'classnames';

const PageButton = (props: { pageNumber: number; selected: boolean }) => {
  return (
    <>
      <li className="usa-pagination__item usa-pagination__page-no">
        <button
          aria-label="Page 1"
          className={classNames(
            'usa-pagination__button',
            'background-none',
            props.selected && 'usa-current',
          )}
        >
          {props.pageNumber}
        </button>
      </li>
    </>
  );
};

const PreviousPage = (props: {
  selectedPage: number;
  onPreviousClick: Function;
}) => {
  return (
    <>
      {props.selectedPage !== 1 && (
        <li className="usa-pagination__item usa-pagination__arrow">
          <button
            aria-label="Previous page"
            className="usa-pagination__link usa-pagination__previous-page background-none border-none"
            onClick={() => {
              props.onPreviousClick();
            }}
          >
            <svg aria-hidden="true" className="usa-icon" role="img">
              <use xlinkHref="/assets/img/sprite.svg#navigate_before"></use>
            </svg>
            <span className="usa-pagination__link-text">Previous</span>
          </button>
        </li>
      )}
    </>
  );
};

const PageElipsis = () => {
  return (
    <>
      <li
        className="usa-pagination__item usa-pagination__overflow"
        role="presentation"
      >
        <span>…</span>
      </li>
    </>
  );
};

export const Paginator = (props: {
  pages: number;
  onPageChange: (selectedPage: number) => any;
}) => {
  const [currentPageNumber, setPageNumber] = useState(4);
  // const middlePageButtons = [];
  // for (let index = 0; index < 3; index++) {
  //   const pageNumberToDisplay = currentPageNumber
  //   middlePageButtons.push(<PageButton pageNumber={currentPageNumber}></PageButton>)
  // }

  return (
    <>
      <nav aria-label="Pagination" className="usa-pagination">
        <ul className="usa-pagination__list">
          <PreviousPage selectedPage={2} onPreviousClick={() => {}} />
          <PageButton pageNumber={1} selected={currentPageNumber === 1} />
          {currentPageNumber > 4 && <PageElipsis />}
          {currentPageNumber <= 4 && (
            <PageButton pageNumber={2} selected={currentPageNumber === 2} />
          )}
          
          <li className="usa-pagination__item usa-pagination__page-no">
            <a
              aria-label="Page 9"
              className="usa-pagination__button"
              href="javascript:void(0);"
            >
              9
            </a>
          </li>
          <li className="usa-pagination__item usa-pagination__page-no">
            <a
              aria-current="page"
              aria-label="Page 10"
              className="usa-pagination__button usa-current"
              href="javascript:void(0);"
            >
              10
            </a>
          </li>
          <li className="usa-pagination__item usa-pagination__page-no">
            <a
              aria-label="Page 11"
              className="usa-pagination__button"
              href="hello.com"
            >
              11
            </a>
          </li>
          <li
            className="usa-pagination__item usa-pagination__overflow"
            role="presentation"
          >
            <span>…</span>
          </li>
          <li className="usa-pagination__item usa-pagination__page-no">
            <a
              aria-label="Last page, page 24"
              className="usa-pagination__button"
              href="hello.com"
            >
              24
            </a>
          </li>
          <li className="usa-pagination__item usa-pagination__arrow">
            <a
              aria-label="Next page"
              className="usa-pagination__link usa-pagination__next-page"
              href="hello.com"
            >
              <span className="usa-pagination__link-text">Next </span>
              <svg aria-hidden="true" className="usa-icon" role="img">
                <use xlinkHref="/assets/img/sprite.svg#navigate_next"></use>
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

Paginator.displayName = 'Paginator';
