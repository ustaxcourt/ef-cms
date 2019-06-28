import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        <h2>Sign Document</h2>
        <>
          <div className="margin-bottom-3">
            <FontAwesomeIcon
              className={
                'icon-button' + (currentPageNumber === 1 ? ' disabled' : '')
              }
              icon={['fas', 'caret-left']}
              size="3x"
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
              size="3x"
              onClick={getNextPage}
            />
          </div>
          <div className="margin-top-3">
            <button
              className="usa-button"
              disabled={!!signatureData}
              onClick={() => completeSigning()}
            >
              <FontAwesomeIcon icon={['far', 'edit']} />
              Apply Signature
            </button>
            <button
              className="usa-button usa-button--unstyled"
              onClick={() => setSignatureData({ signatureData: null })}
            >
              Clear Signature
            </button>
          </div>
        </>
      </div>
    );
  },
);
