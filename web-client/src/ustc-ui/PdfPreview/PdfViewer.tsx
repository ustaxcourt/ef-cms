import React from 'react';

export const PdfViewer = ({
  className,
  id,
  removeToolbar = false,
  src,
  title,
}: {
  className?: string;
  id?: string;
  removeToolbar?: boolean;
  src: string | null;
  title: string;
}) => {
  if (!src) {
    return;
  }
  const pdfProps = { className, id, src, title };

  let classNames: string[] = [];
  if (className) {
    classNames = className.split(' ');
  }

  classNames.push('default-iframe');
  pdfProps.className = classNames.join(' ');

  if (removeToolbar) {
    pdfProps.src = `${pdfProps.src}#toolbar=0`;
  }

  return <iframe {...pdfProps} title="pdf" />;
};

PdfViewer.displayName = 'PdfViewer';
