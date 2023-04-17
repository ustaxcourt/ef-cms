import React, { useState } from 'react';
import classNames from 'classnames';

const PageButton = (props: {
  pageNumber: number;
  selected: boolean;
  onClick: (selectedPage: number) => void;
}) => {
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
          onClick={() => props.onClick(props.pageNumber)}
        >
          {props.pageNumber + 1}
        </button>
      </li>
    </>
  );
};

const PreviousPage = (props: { onPreviousClick: Function }) => {
  return (
    <>
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
    </>
  );
};

const NextPage = (props: { onNextClick: Function }) => {
  return (
    <>
      <li className="usa-pagination__item usa-pagination__arrow">
        <button
          aria-label="Next page"
          className="usa-pagination__link usa-pagination__next-page background-none border-none"
          onClick={() => {
            props.onNextClick();
          }}
        >
          <svg aria-hidden="true" className="usa-icon" role="img">
            <use xlinkHref="/assets/img/sprite.svg#navigate_before"></use>
          </svg>
          <span className="usa-pagination__link-text">Next</span>
        </button>
      </li>
    </>
  );
};

const PageEllipsis = () => {
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

// eslint-disable-next-line complexity
export const Paginator = (props: {
  pages: number;
  onPageChange: (selectedPage: number) => any;
}) => {
  const [currentPageNumber, setPageNumber] = useState(8);
  const sevenDisplayedSlots = [];
  const numberOfPaginatorSlots = 7;
  // 1. Should it render the slot at all?
  // 2. Should it render a page button or an ellipse?
  // 3. Should it render The slot number it is or should it add some extras?

  for (let slotNumber = 0; slotNumber < numberOfPaginatorSlots; slotNumber++) {
    if (slotNumber >= props.pages) {
      continue;
    }
    if (slotNumber === 0) {
      sevenDisplayedSlots.push(
        <PageButton
          pageNumber={0}
          selected={currentPageNumber === 0}
          onClick={selectedPage => {
            setPageNumber(selectedPage);
            props.onPageChange(selectedPage);
          }}
        />,
      );
      continue;
    }
    if (slotNumber === 1) {
      if (currentPageNumber > 3 && props.pages > numberOfPaginatorSlots) {
        sevenDisplayedSlots.push(<PageEllipsis />);
      } else {
        sevenDisplayedSlots.push(
          <PageButton
            pageNumber={1}
            selected={currentPageNumber === 1}
            onClick={selectedPage => {
              setPageNumber(selectedPage);
              props.onPageChange(selectedPage);
            }}
          />,
        );
      }
      continue;
    }
    if (slotNumber === 2 || slotNumber === 3 || slotNumber === 4) {
      if (currentPageNumber < 4) {
        sevenDisplayedSlots.push(
          <PageButton
            pageNumber={slotNumber}
            selected={currentPageNumber === slotNumber}
            onClick={selectedPage => {
              setPageNumber(selectedPage);
              props.onPageChange(selectedPage);
            }}
          />,
        );
        continue;
      }
      if (currentPageNumber >= 4 && props.pages - currentPageNumber > 3) {
        sevenDisplayedSlots.push(
          <PageButton
            pageNumber={currentPageNumber + slotNumber - 3}
            selected={currentPageNumber === currentPageNumber + slotNumber - 3}
            onClick={selectedPage => {
              setPageNumber(selectedPage);
              props.onPageChange(selectedPage);
            }}
          />,
        );
        continue;
      }
      if (currentPageNumber >= 4 && props.pages - currentPageNumber <= 3) {
        sevenDisplayedSlots.push(
          <PageButton
            pageNumber={props.pages - numberOfPaginatorSlots + slotNumber}
            selected={
              currentPageNumber ===
              props.pages - numberOfPaginatorSlots + slotNumber
            }
            onClick={selectedPage => {
              setPageNumber(selectedPage);
              props.onPageChange(selectedPage);
            }}
          />,
        );
        continue;
      }
    }
    if (slotNumber === 5) {
      if (
        props.pages - currentPageNumber > 4 &&
        props.pages > numberOfPaginatorSlots
      ) {
        sevenDisplayedSlots.push(<PageEllipsis />);
      } else {
        sevenDisplayedSlots.push(
          <PageButton
            pageNumber={props.pages - 2}
            selected={currentPageNumber === props.pages - 2}
            onClick={selectedPage => {
              setPageNumber(selectedPage);
              props.onPageChange(selectedPage);
            }}
          />,
        );
      }
      continue;
    }
    if (slotNumber === 6) {
      sevenDisplayedSlots.push(
        <PageButton
          pageNumber={props.pages - 1}
          selected={currentPageNumber === props.pages - 1}
          onClick={selectedPage => {
            setPageNumber(selectedPage);
            props.onPageChange(selectedPage);
          }}
        />,
      );
      continue;
    }
  }

  return (
    <>
      <nav aria-label="Pagination" className="usa-pagination margin-bottom-0">
        <ul className="usa-pagination__list">
          {currentPageNumber !== 0 && (
            <PreviousPage
              onPreviousClick={() => {
                setPageNumber(currentPageNumber - 1);
                props.onPageChange(currentPageNumber - 1);
              }}
            />
          )}
          {sevenDisplayedSlots}
          {currentPageNumber < props.pages - 1 && (
            <NextPage
              onNextClick={() => {
                setPageNumber(currentPageNumber + 1);
                props.onPageChange(currentPageNumber + 1);
              }}
            />
          )}
        </ul>
      </nav>
    </>
  );
};

Paginator.displayName = 'Paginator';
