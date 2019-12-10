import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';

import React, { useEffect } from 'react';

export const PdfPreview = connect(
  {
    clearPdfPreviewUrlSequence: sequences.clearPdfPreviewUrlSequence,
    pdfPreviewUrl: state.pdfPreviewUrl,
    printPdfFromIframeSequence: sequences.printPdfFromIframeSequence,
  },
  ({
    clearPdfPreviewUrlSequence,
    hidden,
    pdfPreviewUrl,
    printable,
    printPdfFromIframeSequence,
  }) => {
    if (!pdfPreviewUrl || process.env.CI) {
      return '';
    }

    useEffect(() => {
      if (printable) {
        printPdfFromIframeSequence();
      }
      return () => clearPdfPreviewUrlSequence();
    }, []);

    return (
      !process.env.CI &&
      pdfPreviewUrl && (
        <iframe
          className={hidden ? 'hide-from-page' : ''}
          id="pdf-preview-iframe"
          src={pdfPreviewUrl}
          title="PDF Preview"
        />
      )
    );
  },
);
