import { Button } from '../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const PDFSignerPageButtons = connect(
  {
    currentPageNumber: state.pdfForSigning.pageNumber,
    disableNext: state.documentSigningHelper.disableNext,
    disablePrevious: state.documentSigningHelper.disablePrevious,
    nextPageNumber: state.documentSigningHelper.nextPageNumber,
    previousPageNumber: state.documentSigningHelper.previousPageNumber,
    setPage: sequences.setPDFPageForSigningSequence,
    totalPages: state.documentSigningHelper.totalPages,
  },
  function PDFSignerPageButtons({
    currentPageNumber,
    disableNext,
    disablePrevious,
    nextPageNumber,
    previousPageNumber,
    setPage,
    totalPages,
  }) {
    const getPreviousPage = () => {
      if (disablePrevious) {
        return;
      }

      setPage({ pageNumber: previousPageNumber });
    };

    const getNextPage = () => {
      if (disableNext) {
        return;
      }

      setPage({ pageNumber: nextPageNumber });
    };

    return (
      <>
        <Button link aria-label="previous page" onClick={getPreviousPage}>
          <FontAwesomeIcon
            className={classNames('icon-button', disablePrevious && 'disabled')}
            icon={['fas', 'caret-left']}
            size="2x"
          />
        </Button>
        <span className="pages">
          Page {currentPageNumber} of {totalPages}
        </span>
        <Button
          link
          aria-label="next page"
          marginDirection="left"
          onClick={getNextPage}
        >
          <FontAwesomeIcon
            className={classNames('icon-button', disableNext && ' disabled')}
            icon={['fas', 'caret-right']}
            size="2x"
          />
        </Button>
      </>
    );
  },
);

PDFSignerPageButtons.displayName = 'PDFSignerPageButtons';
