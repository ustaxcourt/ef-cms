// import 'pdfjs-dist/web/pdf_viewer.css';
// import { EventBus, PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';
import WebViewer from '@pdftron/pdfjs-express-viewer';

// const getPdfJs = async () => {
//   const pdfjsLib = await import('pdfjs-dist');
//   const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
//   pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
//   return pdfjsLib;
// };
// const renderPdf = async (pdfPreviewUrl, ref) => {
//   // eslint-disable-next-line no-restricted-globals
//   const eventBus = new EventBus();

//   let pdfViewer = new PDFViewer({
//     container: ref,
//     eventBus,
//   });

//   const pdfJsLib = await getPdfJs();

//   const doc = await pdfJsLib.getDocument(pdfPreviewUrl).promise;
//   pdfViewer.setDocument(doc);
// };

export const PdfViewer = connect(
  {
    noDocumentText: props.noDocumentText,
    pdfPreviewUrl: state.pdfPreviewUrl,
  },
  function PdfViewer({ noDocumentText, pdfPreviewUrl }) {
    const ref = useRef(null);

    useEffect(() => {
      WebViewer(
        {
          initialDoc: pdfPreviewUrl,
          licenseKey: 'OjkUB41bl1hJg6jvUEfn',
          path: './pdfjsexpress',
        },
        ref.current,
      ).then(instance => {
        // now you can access APIs through the WebViewer instance
        const { Core } = instance;

        // adding an event listener for when a document is loaded
        Core.documentViewer.addEventListener('documentLoaded', () => {
          console.log('document loaded');
        });

        // adding an event listener for when the page number has changed
        Core.documentViewer.addEventListener(
          'pageNumberUpdated',
          pageNumber => {
            console.log(`Page number is: ${pageNumber}`);
          },
        );
      });
    }, []);
    // conditional rendering, no life-cycle hooks.
    if (!pdfPreviewUrl || process.env.CI) {
      return noDocumentText || '';
    }

    return (
      <div>
        <div id="pageContainer">
          <div className="webviewer" id="viewer" ref={ref}></div>
        </div>
      </div>
    );
  },
);
