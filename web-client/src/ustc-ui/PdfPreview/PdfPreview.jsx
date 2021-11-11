import { PdfViewer } from './PdfViewer';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React, { useEffect } from 'react';

const PdfPreviewComponent = connect(
  {
    clearPdfPreviewUrlSequence: sequences.clearPdfPreviewUrlSequence,
    pdfPreviewUrl: state.pdfPreviewUrl,
  },
  function PdfPreviewComponent({
    clearPdfPreviewUrlSequence,
    pdfPreviewUrl,
    scroll = true,
  }) {
    // always renders. use life-cycle hooks here.

    const onRemove = () => {
      clearPdfPreviewUrlSequence();
    };

    useEffect(() => {
      return onRemove;
    }, []);
    const setScroll = scroll ? 'yes' : 'no';
    return (
      <iframe
        id="pdf-preview-iframe"
        scrolling={setScroll}
        src={pdfPreviewUrl}
        title="PDF Preview"
      />
    );
  },
);

export const PdfPreview = connect(
  {
    noDocumentText: props.noDocumentText,
    pdfPreviewUrl: state.pdfPreviewUrl,
  },
  function PdfPreview({ noDocumentText, pdfPreviewUrl, scroll = true }) {
    // conditional rendering, no life-cycle hooks.
    if (!pdfPreviewUrl || process.env.CI) {
      return noDocumentText || '';
    }

    const isPdfJs = true;

    if (isPdfJs) {
      return <PdfViewer />;
    } else {
      return <PdfPreviewComponent scroll={scroll} />;
    }
  },
);
