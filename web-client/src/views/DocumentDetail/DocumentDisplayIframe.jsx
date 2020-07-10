import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';

export const DocumentDisplayIframe = connect(
  {
    caseDetail: state.caseDetail,
    documentDetailHelper: state.documentDetailHelper,
    iframeSrc: state.iframeSrc,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
  },
  function DocumentDisplayIframe({
    caseDetail,
    documentDetailHelper,
    iframeSrc,
    openCaseDocumentDownloadUrlSequence,
  }) {
    useEffect(() => {
      openCaseDocumentDownloadUrlSequence({
        caseId: caseDetail.caseId,
        documentId: documentDetailHelper.formattedDocument.documentId,
        isForIFrame: true,
      });
    }, [caseDetail]);

    return (
      <>
        {/* we can't show the iframe in cypress or else cypress will pause and ask for a save location for the file */}
        {!process.env.CI && (
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            title={`Document type: ${documentDetailHelper.formattedDocument.documentType}`}
          />
        )}
      </>
    );
  },
);
