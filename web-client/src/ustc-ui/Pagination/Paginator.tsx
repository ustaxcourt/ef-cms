import { LeftChevron } from '@web-client/ustc-ui/Icon/LeftChevron';
import { RightChevron } from '@web-client/ustc-ui/Icon/RightChevron';
import React from 'react';
import classNames from 'classnames';

/*
This component is based off of USWDS implementation of a paginator: https://designsystem.digital.gov/components/pagination/
The totalPages and selected page work similarly to counting arrays. TotalPages is similar to array.length and currentPageIndex is 0 based indexing.
totalPages could be 20 but the maximum value currentPageIndex could be is 19 and the lowest pages is 0.
*/

export const Paginator = ({
  currentPageIndex,
  onPageChange,
  showSinglePage = false,
  totalPages,
}: {
  currentPageIndex: number;
  totalPages: number;
  showSinglePage?: boolean;
  onPageChange: (selectedPage: number) => any;
}) => {
  if (totalPages === 0 || totalPages === 1) {
    // This is default behavior requested by UX. Do not show paginator if there is only one page.
    return;
  }
  const numberOfPaginatorSlots = showSinglePage ? 1 : 7;
  const sevenDisplayedSlots: React.JSX.Element[] = [];

  for (let slotNumber = 0; slotNumber < numberOfPaginatorSlots; slotNumber++) {
    if (slotNumber >= totalPages) {
      continue;
    }
    const slotComponent = getSlotComponent({
      currentPageIndex,
      numberOfPaginatorSlots,
      onPageChange,
      slotNumber,
      totalPages,
    });
    sevenDisplayedSlots.push(slotComponent);
  }

  return (
    <>
      <nav
        aria-label="Pagination"
        className="usa-pagination margin-bottom-0 margin-top-0"
      >
        <ul className="usa-pagination__list">
          <PreviousPage
            isHidden={currentPageIndex === 0}
            onPreviousClick={() => {
              onPageChange(currentPageIndex - 1);
            }}
          />
          {sevenDisplayedSlots}
          <NextPage
            isHidden={currentPageIndex === totalPages - 1}
            onNextClick={() => {
              onPageChange(currentPageIndex + 1);
            }}
          />
        </ul>
      </nav>
    </>
  );
};

Paginator.displayName = 'Paginator';

const PageButton = ({
  onClick,
  pageNumber,
  selected,
}: {
  pageNumber: number;
  selected: boolean;
  onClick: (selectedPage: number) => void;
}) => {
  return (
    <>
      <li className="usa-pagination__item usa-pagination__page-no">
        <button
          aria-label={`Page ${pageNumber + 1}`}
          className={classNames(
            'usa-pagination__button',
            'cursor-pointer',
            selected && 'paginator-current',
            !selected && 'background-none',
          )}
          onClick={() => onClick(pageNumber)}
        >
          {pageNumber + 1}
        </button>
      </li>
    </>
  );
};

const PreviousPage = ({
  isHidden,
  onPreviousClick,
}: {
  onPreviousClick: () => void;
  isHidden: boolean;
}) => {
  return (
    <>
      <li className="usa-pagination__item usa-pagination__arrow">
        <button
          aria-label="Previous page"
          className={classNames(
            'usa-pagination__link',
            'usa-pagination__previous-page',
            'background-none',
            'border-none',
            isHidden && 'visibility-hidden',
          )}
          onClick={() => {
            onPreviousClick();
          }}
        >
          <LeftChevron />
          <span className="usa-pagination__link-text">Previous</span>
        </button>
      </li>
    </>
  );
};

const NextPage = ({
  isHidden,
  onNextClick,
}: {
  onNextClick: Function;
  isHidden: boolean;
}) => {
  return (
    <>
      <li className="usa-pagination__item usa-pagination__arrow">
        <button
          aria-label="Next page"
          className={classNames(
            'usa-pagination__link',
            'usa-pagination__next-page',
            'background-none',
            'border-none',
            isHidden && 'visibility-hidden',
          )}
          onClick={() => {
            onNextClick();
          }}
        >
          <span className="usa-pagination__link-text">Next</span>
          <RightChevron />
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
  numberOfPaginatorSlots,
  onPageChange,
  slotNumber,
  totalPages,
}: {
  currentPageIndex: number;
  onPageChange: (selectedPage: number) => any;
  slotNumber: number;
  totalPages: number;
  numberOfPaginatorSlots: number;
}) {
  const isHidingPreviousOptions =
    currentPageIndex > 3 && totalPages > numberOfPaginatorSlots;
  const isHidingFutureOptions =
    totalPages - currentPageIndex > 4 && totalPages > numberOfPaginatorSlots;
  if (slotNumber === 0) {
    if (numberOfPaginatorSlots === 1) {
      return (
        <PageButton
          key={slotNumber}
          pageNumber={currentPageIndex}
          selected={true}
          onClick={selectedPage => {
            onPageChange(selectedPage);
          }}
        />
      );
    }
    return (
      <PageButton
        key={slotNumber}
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
      return <PageEllipsis key={slotNumber} />;
    } else {
      return (
        <PageButton
          key={slotNumber}
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
          key={slotNumber}
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
          key={slotNumber}
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
        key={slotNumber}
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
      return <PageEllipsis key={slotNumber} />;
    } else {
      const subtractor = totalPages >= 7 ? 2 : 1;
      return (
        <PageButton
          key={slotNumber}
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
        key={slotNumber}
        pageNumber={totalPages - 1}
        selected={currentPageIndex === totalPages - 1}
        onClick={selectedPage => {
          onPageChange(selectedPage);
        }}
      />
    );
  }

  return <></>;
}
