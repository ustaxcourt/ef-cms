import React, { useState } from 'react';
import classNames from 'classnames';

const numberOfPaginatorSlots = 7;
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

// eslint-disable-next-line jsdoc/require-jsdoc
function getSlotComponent({
  currentPageNumber,
  onPageChange,
  setPageNumber,
  slotNumber,
  totalPages,
}: {
  currentPageNumber: number;
  onPageChange: (selectedPage: number) => any;
  slotNumber: number;
  totalPages: number;
  setPageNumber: (selectedPage: number) => any;
}) {
  const isHidingPreviousOptions =
    currentPageNumber > 3 && totalPages > numberOfPaginatorSlots;
  const isHidingFutureOptions =
    totalPages - currentPageNumber > 4 && totalPages > numberOfPaginatorSlots;
  if (slotNumber === 0) {
    return (
      <PageButton
        pageNumber={0}
        selected={currentPageNumber === 0}
        onClick={selectedPage => {
          setPageNumber(selectedPage);
          onPageChange(selectedPage);
        }}
      />
    );
  }
  if (slotNumber === 1) {
    if (isHidingPreviousOptions) {
      return <PageEllipsis />;
    } else {
      return (
        <PageButton
          pageNumber={1}
          selected={currentPageNumber === 1}
          onClick={selectedPage => {
            setPageNumber(selectedPage);
            onPageChange(selectedPage);
          }}
        />
      );
    }
  }
  if (slotNumber === 2 || slotNumber === 3 || slotNumber === 4) {
    if (!isHidingPreviousOptions) {
      return (
        <PageButton
          pageNumber={slotNumber}
          selected={currentPageNumber === slotNumber}
          onClick={selectedPage => {
            setPageNumber(selectedPage);
            onPageChange(selectedPage);
          }}
        />
      );
    }
    if (!isHidingFutureOptions) {
      return (
        <PageButton
          pageNumber={totalPages - numberOfPaginatorSlots + slotNumber}
          selected={
            currentPageNumber ===
            totalPages - numberOfPaginatorSlots + slotNumber
          }
          onClick={selectedPage => {
            setPageNumber(selectedPage);
            onPageChange(selectedPage);
          }}
        />
      );
    }
    return (
      <PageButton
        pageNumber={currentPageNumber + slotNumber - 3}
        selected={currentPageNumber === currentPageNumber + slotNumber - 3}
        onClick={selectedPage => {
          setPageNumber(selectedPage);
          onPageChange(selectedPage);
        }}
      />
    );
  }
  if (slotNumber === 5) {
    if (isHidingFutureOptions) {
      return <PageEllipsis />;
    } else {
      const subtractor = totalPages >= 7 ? 2 : 1;
      return (
        <PageButton
          pageNumber={totalPages - subtractor}
          selected={currentPageNumber === totalPages - subtractor}
          onClick={selectedPage => {
            setPageNumber(selectedPage);
            onPageChange(selectedPage);
          }}
        />
      );
    }
  }
  if (slotNumber === 6) {
    return (
      <PageButton
        pageNumber={totalPages - 1}
        selected={currentPageNumber === totalPages - 1}
        onClick={selectedPage => {
          setPageNumber(selectedPage);
          onPageChange(selectedPage);
        }}
      />
    );
  }
}

export const Paginator = (props: {
  totalPages: number;
  onPageChange: (selectedPage: number) => any;
}) => {
  const [currentPageNumber, setPageNumber] = useState(0);
  const sevenDisplayedSlots = [];
  console.log('selected page number: ', currentPageNumber);
  // 1. Should it render the slot at all?
  // 2. Should it render a page button or an ellipse?
  // 3. Should it render The slot number it is or should it add some extras?

  for (let slotNumber = 0; slotNumber < numberOfPaginatorSlots; slotNumber++) {
    if (slotNumber >= props.totalPages) {
      continue;
    }
    const slotComponent = getSlotComponent({
      currentPageNumber,
      onPageChange: props.onPageChange,
      setPageNumber,
      slotNumber,
      totalPages: props.totalPages,
    });
    sevenDisplayedSlots.push(slotComponent);
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
          {currentPageNumber < props.totalPages - 1 && (
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
