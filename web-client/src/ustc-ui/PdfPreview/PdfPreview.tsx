import { PdfViewer } from './PdfViewer';
import { connect } from '@cerebral/react';
import { props } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PdfPreview = connect(
  {
    noDocumentText: props.noDocumentText,
    pdfPreviewUrl: state.pdfPreviewUrl,
  },
  function PdfPreview({ noDocumentText, pdfPreviewUrl }) {
    // conditional rendering, no life-cycle hooks.
    if (!pdfPreviewUrl || process.env.CI) {
      return noDocumentText || '';
    }

    return <PdfViewer className="pdf-preview-viewer" src={pdfPreviewUrl} />;
  },
);

PdfPreview.displayName = 'PdfPreview';
