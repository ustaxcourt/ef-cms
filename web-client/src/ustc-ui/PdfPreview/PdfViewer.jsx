import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';
import WebViewer from '@pdftron/pdfjs-express-viewer';

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
        const { Core } = instance;
        const { documentViewer } = Core;

        instance.UI.setHeaderItems(header => {
          header.push({
            img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
            onClick: async () => {
              // must wait for the document to be loaded before you can save the file
              // documentViewer.addEventListener('documentLoaded', async () => {
              const documentStream = await documentViewer
                .getDocument()
                .getFileData({});

              const fileName = await documentViewer.getDocument().getFilename();

              const documentBlob = new Blob([documentStream], {
                type: 'application/pdf',
              });
              const blobUrl = URL.createObjectURL(documentBlob);

              const link = window.document.createElement('a');
              link.href = blobUrl;
              link.download = `${fileName}`;
              link.click();
            },
            type: 'actionButton',
          });
        });
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
