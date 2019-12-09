import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const DocumentDisplayIframe = connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.caseDetail,
    documentDetailHelper: state.documentDetailHelper,
    token: state.token,
  },
  ({ baseUrl, caseDetail, documentDetailHelper, token }) => {
    return (
      <>
        {/* we can't show the iframe in cypress or else cypress will pause and ask for a save location for the file */}
        {!process.env.CI && (
          <iframe
            key={documentDetailHelper.formattedDocument.signedAt}
            src={`${baseUrl}/case-documents/${caseDetail.caseId}/${documentDetailHelper.formattedDocument.documentId}/document-download-url?token=${token}`}
            title={`Document type: ${documentDetailHelper.formattedDocument.documentType}`}
          />
        )}
      </>
    );
  },
);
