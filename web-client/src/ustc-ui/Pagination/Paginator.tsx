import React from 'react';
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

function getSlotComponent({
  currentPageIndex,
  onPageChange,
  slotNumber,
  totalPages,
}: {
  currentPageIndex: number;
  onPageChange: (selectedPage: number) => any;
  slotNumber: number;
  totalPages: number;
}) {
  const isHidingPreviousOptions =
    currentPageIndex > 3 && totalPages > numberOfPaginatorSlots;
  const isHidingFutureOptions =
    totalPages - currentPageIndex > 4 && totalPages > numberOfPaginatorSlots;
  if (slotNumber === 0) {
    return (
      <PageButton
        pageNumber={0}
        selected={currentPageIndex === 0}
        onClick={selectedPage => {
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
          selected={currentPageIndex === 1}
          onClick={selectedPage => {
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
          selected={currentPageIndex === slotNumber}
          onClick={selectedPage => {
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
            currentPageIndex ===
            totalPages - numberOfPaginatorSlots + slotNumber
          }
          onClick={selectedPage => {
            onPageChange(selectedPage);
          }}
        />
      );
    }
    return (
      <PageButton
        pageNumber={currentPageIndex + slotNumber - 3}
        selected={currentPageIndex === currentPageIndex + slotNumber - 3}
        onClick={selectedPage => {
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
          selected={currentPageIndex === totalPages - subtractor}
          onClick={selectedPage => {
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
        selected={currentPageIndex === totalPages - 1}
        onClick={selectedPage => {
          onPageChange(selectedPage);
        }}
      />
    );
  }
}

/*
This component is based off of USWDS implementation of a paginator: https://designsystem.digital.gov/components/pagination/
The totalPages and selected page work similarly to counting arrays. TotalPages is similar to array.length and selectedPage is 0 based indexing.
totalPages could be 20 but the maximum value selectedPage could be is 19 and the lowest pages is 0.
*/

export const Paginator = ({
  currentPageIndex,
  onPageChange,
  totalPages,
}: {
  currentPageIndex: number;
  totalPages: number;
  onPageChange: (selectedPage: number) => any;
}) => {
  const sevenDisplayedSlots = [];
  console.log('selected page number: ', currentPageIndex);
  // 1. Should it render the slot at all?
  // 2. Should it render a page button or an ellipse?
  // 3. Should it render The slot number it is or should it add some extras?

  for (let slotNumber = 0; slotNumber < numberOfPaginatorSlots; slotNumber++) {
    if (slotNumber >= totalPages) {
      continue;
    }
    const slotComponent = getSlotComponent({
      currentPageIndex,
      onPageChange,
      slotNumber,
      totalPages,
    });
    sevenDisplayedSlots.push(slotComponent);
  }

  return (
    <>
      <nav aria-label="Pagination" className="usa-pagination margin-bottom-0">
        <ul className="usa-pagination__list">
          {currentPageIndex !== 0 && (
            <PreviousPage
              onPreviousClick={() => {
                onPageChange(currentPageIndex - 1);
              }}
            />
          )}
          {sevenDisplayedSlots}
          {currentPageIndex < totalPages - 1 && (
            <NextPage
              onNextClick={() => {
                onPageChange(currentPageIndex + 1);
              }}
            />
          )}
        </ul>
      </nav>
    </>
  );
};

Paginator.displayName = 'Paginator';
