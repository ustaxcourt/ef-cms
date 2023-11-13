import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const PdfViewer = connect({}, ({ className, id, src, title }) => {
  const pdfProps = { className, id, src, title };

  let classNames = [];
  if (className) {
    classNames = className.split(' ');
  }

  classNames.push('default-iframe');
  pdfProps.className = classNames.join(' ');

  return <iframe {...pdfProps} />;
});

PdfViewer.displayName = 'PdfViewer';
