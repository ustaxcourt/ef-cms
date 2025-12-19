import { PdfViewer } from './PdfViewer';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props as cerebralProps } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

const props = cerebralProps as unknown as {
  heightOverride: boolean;
  noDocumentText: string;
  removeToolbar: boolean;
};

const pdfPreviewDeps = {
  heightOverride: props.heightOverride,
  noDocumentText: props.noDocumentText,
  pdfPreviewUrl: state.pdfPreviewUrl,
  removeToolbar: props.removeToolbar,
};

export const PdfPreview = connect(
  pdfPreviewDeps,
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
        className={classNames([!heightOverride && 'pdf-preview-viewer'])}
        removeToolbar={removeToolbar}
        src={pdfPreviewUrl}
        title="pdf-preview-viewer"
      />
    );
  },
);

PdfPreview.displayName = 'PdfPreview';
