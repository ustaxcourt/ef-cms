import { PdfViewer } from './PdfViewer';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from '../../utilities/cerebralWrapper';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PdfPreview = connect(
  {
    heightOverride: props.heightOverride,
    noDocumentText: props.noDocumentText,
    pdfPreviewUrl: state.pdfPreviewUrl,
    removeToolbar: props.removeToolbar,
  },
  function PdfPreview({
    heightOverride,
    noDocumentText,
    pdfPreviewUrl,
    removeToolbar = false,
  }: {
    heightOverride: boolean;
    noDocumentText: string;
    pdfPreviewUrl: string;
    removeToolbar: boolean;
  }) {
    // conditional rendering, no life-cycle hooks.
    if (!pdfPreviewUrl || process.env.CI) {
      return noDocumentText || '';
    }

    return (
      <PdfViewer
        className={!heightOverride && 'pdf-preview-viewer'}
        removeToolbar={removeToolbar}
        src={pdfPreviewUrl}
        title="pdf-preview-viewer"
      />
    );
  },
);

PdfPreview.displayName = 'PdfPreview';
