import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const PdfViewer = connect(
  {},
  ({ className, id, removeToolbar = false, src, title }) => {
    const pdfProps = { className, id, src, title };

    let classNames = [];
    if (className) {
      classNames = className.split(' ');
    }

    classNames.push('default-iframe');
    pdfProps.className = classNames.join(' ');

    if (removeToolbar) {
      pdfProps.src = `${pdfProps.src}#toolbar=0`;
    }

    return <iframe {...pdfProps} title="pdf" />;
  },
);

PdfViewer.displayName = 'PdfViewer';
