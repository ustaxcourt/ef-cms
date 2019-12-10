import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';

import React, { useEffect } from 'react';

const PdfPreviewComponent = connect(
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
    // always renders. use life-cycle hooks here.

    const onRender = () => {
      if (printable) {
        printPdfFromIframeSequence();
      }
    };

    const onRemove = () => {
      clearPdfPreviewUrlSequence();
    };

    useEffect(() => {
      onRender();
      return onRemove;
    }, []);

    return (
      <iframe
        className={hidden ? 'hide-from-page' : ''}
        id="pdf-preview-iframe"
        src={pdfPreviewUrl}
        title="PDF Preview"
      />
    );
  },
);

export const PdfPreview = connect(
  {
    pdfPreviewUrl: state.pdfPreviewUrl,
  },
  ({ hidden, pdfPreviewUrl, printable }) => {
    // conditional rendering, no life-cycle hooks.
    if (!pdfPreviewUrl || process.env.CI) {
      return '';
    }

    return <PdfPreviewComponent hidden={!!hidden} printable={!!printable} />;
  },
);
