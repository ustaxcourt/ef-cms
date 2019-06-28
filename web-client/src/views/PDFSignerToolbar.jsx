import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PDFSignerToolbar = connect(
  {
    completeSigning: sequences.completeDocumentSigningSequence,
    currentPageNumber: state.pdfForSigning.pageNumber,
    pdfObj: state.pdfForSigning.pdfjsObj,
    setPage: sequences.setPDFPageForSigningSequence,
    setSignatureData: sequences.setPDFSignatureDataSequence,
    signatureData: state.pdfForSigning.signatureData,
  },
  ({
    completeSigning,
    currentPageNumber,
    pdfObj,
    setPage,
    setSignatureData,
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
        {signatureData === null && (
          <>
            <button
              className="usa-button"
              disabled={currentPageNumber === 1}
              onClick={getPreviousPage}
            >
              Previous Page
            </button>
            <button
              className="usa-button margin-left-2"
              disabled={currentPageNumber === pdfObj.numPages}
              onClick={getNextPage}
            >
              Next Page
            </button>
            <div className="margin-top-2">
              Page {currentPageNumber} of {pdfObj.numPages}
            </div>
          </>
        )}
        {signatureData !== null && (
          <>
            <button
              className="usa-button usa-button--outline"
              onClick={() => setSignatureData({ signatureData: null })}
            >
              Reset
            </button>
            <button className="usa-button" onClick={() => completeSigning()}>
              Complete Signing
            </button>
          </>
        )}
      </div>
    );
  },
);
