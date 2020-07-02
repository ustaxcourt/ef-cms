import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
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
      <iframe id="pdf-preview-iframe" src={pdfPreviewUrl} title="PDF Preview" />
    );
  },
);

export const PdfPreview = connect(
  {
    noDocumentText: props.noDocumentText,
    pdfPreviewUrl: state.pdfPreviewUrl,
  },
  function PdfPreview({ noDocumentText, pdfPreviewUrl }) {
    // conditional rendering, no life-cycle hooks.
    if (!pdfPreviewUrl || process.env.CI) {
      return noDocumentText ? noDocumentText : '';
    }

    return <PdfPreviewComponent />;
  },
);
