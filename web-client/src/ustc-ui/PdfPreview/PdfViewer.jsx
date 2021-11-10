import 'pdfjs-dist/web/pdf_viewer.css';
import { PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';

const getPdfJs = async () => {
  const pdfjsLib = await import('pdfjs-dist');
  const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  return pdfjsLib;
};

export const PdfViewer = connect(
  {
    noDocumentText: props.noDocumentText,
    pdfPreviewUrl: state.pdfPreviewUrl,
  },
  function PdfViewer({ noDocumentText, pdfPreviewUrl }) {
    const ref = useRef(null);

    useEffect(() => {
      // eslint-disable-next-line no-restricted-globals
      const element = document.getElementById('pdf-js');

      let pdfViewer = new PDFViewer({
        container: element,
      });

      getPdfJs()
        .then(pdfJsLib => pdfJsLib.getDocument(pdfPreviewUrl))
        .then(pdf => {
          pdfViewer.setDocument(pdf);
        });
    });
    // conditional rendering, no life-cycle hooks.
    if (!pdfPreviewUrl || process.env.CI) {
      return noDocumentText || '';
    }

    return <div id="pdf-js" ref={ref}></div>;
  },
);
