import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PDFSignerToolbar = connect(
  {
    currentPageNumber: state.pdfForSigning.pageNumber,
    pdfObj: state.pdfForSigning.pdfjsObj,
    setPage: sequences.setPDFPageForSigningSequence,
    signatureData: state.pdfForSigning.signatureData,
  },
  ({
    applySignature,
    clearSignature,
    currentPageNumber,
    pdfObj,
    setPage,
    signatureApplied = false,
    signatureData,
  }) => {
    const getPreviousPage = () => {
      const previousPageNumber =
        currentPageNumber === 1 ? 1 : currentPageNumber - 1;
      setPage({ pageNumber: previousPageNumber });
    };

    const getNextPage = () => {
      const totalPages = pdfObj.numPages;
      const nextPageNumber =
        currentPageNumber === totalPages ? totalPages : currentPageNumber + 1;
      setPage({ pageNumber: nextPageNumber });
    };

    return (
      <div className="sign-pdf-control">
        <h3>Sign Document</h3>
        <>
          <div className="margin-bottom-3">
            <FontAwesomeIcon
              className={
                'icon-button' + (currentPageNumber === 1 ? ' disabled' : '')
              }
              icon={['fas', 'caret-left']}
              size="2x"
              onClick={getPreviousPage}
            />
            <span className="pages">
              Page {currentPageNumber} of {pdfObj.numPages}
            </span>
            <FontAwesomeIcon
              className={
                'icon-button' +
                (currentPageNumber === pdfObj.numPages ? ' disabled' : '')
              }
              icon={['fas', 'caret-right']}
              size="2x"
              onClick={getNextPage}
            />
          </div>
          <div className="margin-top-3">
            <button
              className="usa-button"
              disabled={!!signatureData || signatureApplied}
              onClick={() => applySignature()}
            >
              <FontAwesomeIcon icon={['fas', 'edit']} />
              Apply Signature
            </button>
            {!!signatureData && (
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
