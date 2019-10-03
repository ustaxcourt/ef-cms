import { Button } from '../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PDFSignerToolbar = connect(
  {
    currentPageNumber: state.pdfForSigning.pageNumber,
    disableNext: state.documentSigningHelper.disableNext,
    disablePrevious: state.documentSigningHelper.disablePrevious,
    isPdfAlreadySigned: state.pdfForSigning.isPdfAlreadySigned,
    nextPageNumber: state.documentSigningHelper.nextPageNumber,
    previousPageNumber: state.documentSigningHelper.previousPageNumber,
    setPage: sequences.setPDFPageForSigningSequence,
    signatureApplied: state.pdfForSigning.signatureApplied,
    totalPages: state.documentSigningHelper.totalPages,
  },
  ({
    applySignature,
    clearSignature,
    currentPageNumber,
    disableNext,
    disablePrevious,
    isPdfAlreadySigned,
    nextPageNumber,
    previousPageNumber,
    setPage,
    signatureApplied,
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
      <div className="sign-pdf-control">
        <h3>Sign Document</h3>
        <>
          <div className="margin-bottom-3">
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
          </div>
          <div className="margin-top-3">
            <Button
              disabled={signatureApplied || isPdfAlreadySigned}
              onClick={() => applySignature()}
            >
              <FontAwesomeIcon icon={['fas', 'edit']} />
              Apply Signature
            </Button>
            {(signatureApplied || isPdfAlreadySigned) && (
              <Button link onClick={() => clearSignature()}>
                Clear Signature
              </Button>
            )}
          </div>
        </>
      </div>
    );
  },
);
