import { PdfViewer } from './PdfViewer';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PdfPreview = connect(
  {
    heightOverride: props.heightOverride,
    noDocumentText: props.noDocumentText,
    pdfPreviewUrl: state.pdfPreviewUrl,
  },
  function PdfPreview({ heightOverride, noDocumentText, pdfPreviewUrl }) {
    // conditional rendering, no life-cycle hooks.
    if (!pdfPreviewUrl || process.env.CI) {
      return noDocumentText || '';
    }

    return (
      <PdfViewer
        className={!heightOverride && 'pdf-preview-viewer'}
        src={pdfPreviewUrl}
      />
    );
  },
);

PdfPreview.displayName = 'PdfPreview';
