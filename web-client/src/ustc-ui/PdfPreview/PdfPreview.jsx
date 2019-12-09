import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';

import React, { useEffect } from 'react';

export const PdfPreview = connect(
  {
    clearPdfPreviewUrlSequence: sequences.clearPdfPreviewUrlSequence,
    pdfPreviewUrl: state.pdfPreviewUrl,
  },
  ({ clearPdfPreviewUrlSequence, hidden, pdfPreviewUrl }) => {
    useEffect(() => () => clearPdfPreviewUrlSequence(), []);

    if (!pdfPreviewUrl) {
      return '';
    }
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
