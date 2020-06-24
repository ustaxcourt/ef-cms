import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseMessagesRowAttachments = connect(
  {
    baseUrl: state.baseUrl,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    token: state.token,
  },
  function CaseMessagesRowAttachments({
    attachments,
    caseId,
    openCaseDocumentDownloadUrlSequence,
  }) {
    return (
      <>
        {attachments &&
          attachments.map((attachment, idx) => {
            return (
              <div className="margin-bottom-1" key={idx}>
                <Button
                  link
                  icon="file-pdf"
                  iconColor="blue"
                  onClick={() => {
                    openCaseDocumentDownloadUrlSequence({
                      caseId,
                      documentId: attachment.documentId,
                    });
                  }}
                >
                  {attachment.documentTitle}
                </Button>
              </div>
            );
          })}
      </>
    );
  },
);
