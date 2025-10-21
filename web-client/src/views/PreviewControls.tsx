import { Button } from '../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props as cerebralProps } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const props = cerebralProps as unknown as {
  currentPage: number;
  disableLeftButtons: boolean;
  disableRightButtons: boolean;
  onFirstPage: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onLastPage: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onNextPage: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onPreviousPage: (e: React.MouseEvent<HTMLButtonElement>) => void;
  totalPages: number;
};

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
  function PreviewControls({
    currentPage,
    disableLeftButtons,
    disableRightButtons,
    onFirstPage,
    onLastPage,
    onNextPage,
    onPreviousPage,
    totalPages,
  }) {
    return (
      <div className="pdf-preview-controls">
        <Button
          link
          className={classNames(disableLeftButtons && 'disabled')}
          title="pdf preview first page"
          onClick={onFirstPage}
        >
          <FontAwesomeIcon
            className={'icon-button'}
            icon={['fas', 'step-backward']}
            id="firstPage"
            size="2x"
          />
        </Button>
        <Button
          link
          className={classNames(disableLeftButtons && 'disabled')}
          title="pdf preview previous page"
          onClick={onPreviousPage}
        >
          <FontAwesomeIcon
            className={'icon-button'}
            icon={['fas', 'caret-left']}
            id="previous"
            size="2x"
          />
        </Button>
        <span className="pages">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          link
          className={classNames(disableRightButtons && 'disabled')}
          title="pdf preview next page"
          onClick={onNextPage}
        >
          <FontAwesomeIcon
            className={'icon-button'}
            icon={['fas', 'caret-right']}
            id="next"
            size="2x"
          />
        </Button>
        <Button
          link
          className={classNames(disableRightButtons && 'disabled')}
          title="pdf preview last page"
          onClick={onLastPage}
        >
          <FontAwesomeIcon
            className={'icon-button'}
            icon={['fas', 'step-forward']}
            id="lastPage"
            size="2x"
          />
        </Button>
      </div>
    );
  },
);

PreviewControls.displayName = 'PreviewControls';
