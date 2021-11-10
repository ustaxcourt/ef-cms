import 'pdfjs-dist/web/pdf_viewer.css';
import { EventBus, PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';

const getPdfJs = async () => {
  const pdfjsLib = await import('pdfjs-dist');
  const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  return pdfjsLib;
};
const renderPdf = async (pdfPreviewUrl, ref) => {
  // eslint-disable-next-line no-restricted-globals
  const eventBus = new EventBus();

  let pdfViewer = new PDFViewer({
    container: ref,
    eventBus,
  });

  const pdfJsLib = await getPdfJs();

  const doc = await pdfJsLib.getDocument(pdfPreviewUrl).promise;
  pdfViewer.setDocument(doc);
};

export const PdfViewer = connect(
  {
    noDocumentText: props.noDocumentText,
    pdfPreviewUrl: state.pdfPreviewUrl,
  },
  function PdfViewer({ noDocumentText, pdfPreviewUrl }) {
    const ref = useRef(null);

    useEffect(() => {
      renderPdf(pdfPreviewUrl, ref.current);
    });
    // conditional rendering, no life-cycle hooks.
    if (!pdfPreviewUrl || process.env.CI) {
      return noDocumentText || '';
    }

    return (
      <div>
        <div id="pageContainer" ref={ref} style={{ position: 'absolute' }}>
          <div className="pdfViewer" id="viewer"></div>
        </div>
      </div>
    );
  },
);
