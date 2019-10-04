import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

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
  ({
    currentPageNumber,
    disableNext,
    disablePrevious,
    nextPageNumber,
    previousPageNumber,
    setPage,
    totalPages,
  }) => {
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
        <FontAwesomeIcon
          className={'icon-button' + (disablePrevious ? ' disabled' : '')}
          icon={['fas', 'caret-left']}
          size="2x"
          onClick={getPreviousPage}
        />
        <span className="pages">
          Page {currentPageNumber} of {totalPages}
        </span>
        <FontAwesomeIcon
          className={'icon-button' + (disableNext ? ' disabled' : '')}
          icon={['fas', 'caret-right']}
          size="2x"
          onClick={getNextPage}
        />
      </>
    );
  },
);
