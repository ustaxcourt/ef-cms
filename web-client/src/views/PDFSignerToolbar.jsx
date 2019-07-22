import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PDFSignerToolbar = connect(
  {
    currentPageNumber: state.pdfForSigning.pageNumber,
    disableNext: state.documentSigningHelper.disableNext,
    disablePrevious: state.documentSigningHelper.disablePrevious,
    nextPageNumber: state.documentSigningHelper.nextPageNumber,
    pdfObj: state.pdfForSigning.pdfjsObj,
    previousPageNumber: state.documentSigningHelper.previousPageNumber,
    setPage: sequences.setPDFPageForSigningSequence,
    signatureApplied: state.pdfForSigning.signatureApplied,
    signatureData: state.pdfForSigning.signatureData,
    totalPages: state.documentSigningHelper.totalPages,
  },
  ({
    applySignature,
    clearSignature,
    currentPageNumber,
    disableNext,
    disablePrevious,
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
            <button
              className="usa-button"
              disabled={signatureApplied}
              onClick={() => applySignature()}
            >
              <FontAwesomeIcon icon={['fas', 'edit']} />
              Apply Signature
            </button>
            {signatureApplied && (
              <button
                className="usa-button usa-button--unstyled"
                onClick={() => clearSignature()}
              >
                Clear Signature
              </button>
            )}
          </div>
        </>
      </div>
    );
  },
);
