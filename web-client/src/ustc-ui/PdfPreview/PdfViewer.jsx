import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import WebViewer from '@pdftron/pdfjs-express-viewer';

export const PdfViewer = connect(
  {
    featureFlagHelper: state.featureFlagHelper,
  },
  ({ featureFlagHelper, id, src, title }) => {
    const pdfProps = { id, src, title };
    if (featureFlagHelper.isPdfJsEnabled) {
      return <PdfViewerComponent {...pdfProps} />;
    } else {
      return <iframe className="viewer-iframe" {...pdfProps} />;
    }
  },
);

const loadDocument = ({ src, viewer }) => {
  const { UI } = viewer;
  UI.loadDocument(src, { extension: 'pdf' });
};

/**
 * Sets up new pdfViewer instance and adds a download button to the header
 *
 * @param {object} args - arguments
 * @param {Element} args.node -  the DOM element to attach the viewer to
 * @param {string} args.src - the url of the pdf to load
 * @returns {Promise} - a promise that resolves to the pdfViewer instance
 */
const setupViewer = async ({ node, src }) => {
  const newViewer = await WebViewer(
    {
      extension: 'pdf',
      initialDoc: src,
      licenseKey: process.env.PDF_EXPRESS_LICENSE_KEY,
      path: '/pdfjsexpress',
    },
    node,
  );

  const {
    Core: { documentViewer },
    UI,
  } = newViewer;

  UI.setHeaderItems(header => {
    header.push({
      img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
      onClick: async () => {
        // must wait for the document to be loaded before you can save the file
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

  return newViewer;
};

/**
 * Creates hooks for the pdf viewer
 *
 * @param {object} args - arguments
 * @param {string} args.src - the url of the pdf to load
 * @returns {object} - the DOM reference
 */
function useHookWithRefCallback({ src }) {
  // this is needed to keep track of the node when the component is destroyed
  const ref = useRef();
  // we need this state reference for the useEffect that listens for src changes
  // useEffect is not able to listen for ref.current, so we have another state variable
  // to trigger the effect.
  const [viewer, setViewer] = useState();

  // this useCallback ref is called when the dom node is created and destroyed,
  // such as when we leave the page that had the pdf viewer
  const setRef = useCallback(node => {
    if (!node && ref.current) {
      ref.current.dispose();
      return;
    }

    if (node) {
      setupViewer({ node, src }).then(v => {
        setViewer(v);
        ref.current = v;
      });
    }
  }, []);

  useEffect(() => {
    // ref.current is sometimes never defined when it should be on this initial call; therefore,
    // we use a viewer state hook.
    if (viewer && src) {
      loadDocument({ src, viewer });
    }
  }, [src, viewer]);

  return setRef;
}

const PdfViewerComponent = function PdfViewerComponent({ id, src, title }) {
  const webViewer = useHookWithRefCallback({ src });
  const viewerProps = { id, title };

  if (!src || process.env.CI) {
    return '';
  }

  return (
    <div {...viewerProps} className="express-pdf-viewer" ref={webViewer}></div>
  );
};
