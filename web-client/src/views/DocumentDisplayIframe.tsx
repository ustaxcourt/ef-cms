import { PdfViewer } from '../ustc-ui/PdfPreview/PdfViewer';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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
          <PdfViewer
            key={iframeSrc}
            src={iframeSrc}
            title={`Document type: ${formattedDocument.documentType}`}
          />
        )}
      </>
    );
  },
);

DocumentDisplayIframe.displayName = 'DocumentDisplayIframe';
