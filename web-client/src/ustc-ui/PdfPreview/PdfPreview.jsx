import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';

import React, { useEffect } from 'react';

export const PdfPreview = connect(
  {
    clearPdfPreviewUrlSequence: sequences.clearPdfPreviewUrlSequence,
    pdfPreviewUrl: state.pdfPreviewUrl,
  },
  ({ clearPdfPreviewUrlSequence, pdfPreviewUrl }) => {
    useEffect(() => () => clearPdfPreviewUrlSequence(), []);

    return (
      !process.env.CI &&
      pdfPreviewUrl && (
        <iframe
          id="pdf-preview-iframe"
          src={pdfPreviewUrl}
          title="PDF Preview"
        />
      )
    );
  },
);
