import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';

import React, { useEffect } from 'react';

const PdfPreviewComponent = connect(
  {
    clearPdfPreviewUrlSequence: sequences.clearPdfPreviewUrlSequence,
    pdfPreviewUrl: state.pdfPreviewUrl,
  },
  function PdfPreviewComponent({ clearPdfPreviewUrlSequence, pdfPreviewUrl }) {
    // always renders. use life-cycle hooks here.

    const onRemove = () => {
      clearPdfPreviewUrlSequence();
    };

    useEffect(() => {
      return onRemove;
    }, []);

    return (
      !process.env.CI && (
        <iframe
          id="pdf-preview-iframe"
          src={pdfPreviewUrl}
          title="PDF Preview"
        />
      )
    );
  },
);

export const PdfPreview = connect(
  {
    pdfPreviewUrl: state.pdfPreviewUrl,
  },
  function PdfPreview({ pdfPreviewUrl }) {
    // conditional rendering, no life-cycle hooks.
    if (!pdfPreviewUrl || process.env.CI) {
      return '';
    }

    return <PdfPreviewComponent />;
  },
);
