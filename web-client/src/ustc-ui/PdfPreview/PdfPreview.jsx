import { PdfViewer } from './PdfViewer';
import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React from 'react';

export const PdfPreview = connect(
  {
    noDocumentText: props.noDocumentText,
    pdfPreviewUrl: state.pdfPreviewUrl,
  },
  function PdfPreview({ noDocumentText, pdfPreviewUrl, scrolling = 'true' }) {
    // conditional rendering, no life-cycle hooks.
    if (!pdfPreviewUrl || process.env.CI) {
      return noDocumentText || '';
    }

    const pdfProps = { scrolling, src: pdfPreviewUrl };

    // warning: PDFPreviewModal uses scroll=false.  find out why, see what we can do to support it when using pdfjs here.
    return <PdfViewer {...pdfProps} />;
  },
);
