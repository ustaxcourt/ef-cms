import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props } from 'cerebral';
import React from 'react';

export const PreviewControls = connect(
  {
    currentPage: props.currentPage,
    disableLeftButtons: props.disableLeftButtons,
    disableRightButtons: props.disableRightButtons,
    onFirstPage: props.onFirstPage,
    onLastPage: props.onLastPage,
    onNextPage: props.onNextPage,
    onPreviousPage: props.onPreviousPage,
    totalPages: props.totalPages,
  },
  ({
    currentPage,
    disableLeftButtons,
    disableRightButtons,
    onFirstPage,
    onLastPage,
    onNextPage,
    onPreviousPage,
    totalPages,
  }) => {
    return (
      <div className="pdf-preview-controls">
        <button
          className={
            'usa-button usa-button--unstyled' +
            (disableLeftButtons ? ' disabled' : '')
          }
          title="pdf preview first page"
          onClick={onFirstPage}
        >
          <FontAwesomeIcon
            className={'icon-button'}
            icon={['fas', 'step-backward']}
            id="firstPage"
            size="2x"
          />
        </button>
        <button
          className={
            'usa-button usa-button--unstyled' +
            (disableLeftButtons ? ' disabled' : '')
          }
          title="pdf preview previous page"
          onClick={onPreviousPage}
        >
          <FontAwesomeIcon
            className={'icon-button'}
            icon={['fas', 'caret-left']}
            id="prev"
            size="2x"
          />
        </button>
        <span className="pages">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={
            'usa-button usa-button--unstyled' +
            (disableRightButtons ? ' disabled' : '')
          }
          title="pdf preview next page"
          onClick={onNextPage}
        >
          <FontAwesomeIcon
            className={'icon-button'}
            icon={['fas', 'caret-right']}
            id="next"
            size="2x"
          />
        </button>
        <button
          className={
            'usa-button usa-button--unstyled' +
            (disableRightButtons ? ' disabled' : '')
          }
          title="pdf preview last page"
          onClick={onLastPage}
        >
          <FontAwesomeIcon
            className={'icon-button'}
            icon={['fas', 'step-forward']}
            id="lastPage"
            size="2x"
          />
        </button>
      </div>
    );
  },
);
