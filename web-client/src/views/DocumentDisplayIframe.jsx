import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';

export const DocumentDisplayIframe = connect(
  {
    caseDetail: state.caseDetail,
    docketEntryId: state.docketEntryId,
    formattedDocument: state.formattedDocument,
    iframeSrc: state.iframeSrc,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
  },
  function DocumentDisplayIframe({
    caseDetail,
    docketEntryId,
    formattedDocument,
    iframeSrc,
    openCaseDocumentDownloadUrlSequence,
  }) {
    useEffect(() => {
      openCaseDocumentDownloadUrlSequence({
        docketEntryId,
        docketNumber: caseDetail.docketNumber,
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
            title={`Document type: ${formattedDocument.documentType}`}
          />
        )}
      </>
    );
  },
);
