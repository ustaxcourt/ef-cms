import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React, { useEffect, useRef } from 'react';
import WebViewer from '@pdftron/pdfjs-express-viewer';

const PDF_EXPRESS_LICENSE_KEY = 'OjkUB41bl1hJg6jvUEfn';

export const PdfViewer = connect(
  {
    featureFlagHelper: state.featureFlagHelper,
    isPdfJsEnabled: state.featureFlag.isPdfJsEnabled,
  },
  ({ featureFlagHelper, ...pdfProps }) => {
    if (featureFlagHelper.isPdfJsEnabled) {
      return <PdfViewerComponent {...pdfProps} />;
    } else {
      return <iframe {...pdfProps} />;
    }
  },
);

const PdfViewerComponent = function PdfViewerComponent({
  id,
  scrolling,
  src,
  title,
}) {
  const webviewer = useRef(null);
  const viewerProps = { id, scrolling, title };

  useEffect(() => {
    WebViewer(
      {
        extension: 'pdf',
        initialDoc: src,
        licenseKey: PDF_EXPRESS_LICENSE_KEY,
        path: '/pdfjsexpress',
      },
      webviewer.current,
    ).then(({ Core: { documentViewer }, UI }) => {
      UI.setHeaderItems(header => {
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
            const link = window.document.createElement('a');
            link.href = URL.createObjectURL(documentBlob);
            link.download = `${fileName}.pdf`;
            link.click();
          },
          title: 'Download',
          type: 'actionButton',
        });
      });
    });
  }, []);
  // conditional rendering, no life-cycle hooks.
  if (!src || process.env.CI) {
    return '';
  }

  return (
    <div {...viewerProps} className="express-pdf-viewer" ref={webviewer}></div>
  );
};
