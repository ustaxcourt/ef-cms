import { Button } from '../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PDFSignerPageButtons } from './PDFSignerPageButtons';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PDFSignerToolbar = connect(
  {
    isPdfAlreadySigned: state.pdfForSigning.isPdfAlreadySigned,
    signatureApplied: state.pdfForSigning.signatureApplied,
  },
  function PDFSignerToolbar({
    applySignature,
    clearSignature,
    isPdfAlreadySigned,
    signatureApplied,
  }) {
    return (
      <div className="sign-pdf-control">
        <h3>Sign Document</h3>
        <>
          <div className="margin-bottom-3">
            <PDFSignerPageButtons />
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
