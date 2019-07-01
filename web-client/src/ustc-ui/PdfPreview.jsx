import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PdfPreview = connect(
  {
    blobUrl: state.pdfPreviewUrl,
  },
  ({ blobUrl }) => {
    return <>{blobUrl && <iframe id="pdf-preview-iframe" src={blobUrl} />}</>;
  },
);
