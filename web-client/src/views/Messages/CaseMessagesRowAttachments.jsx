import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const CaseMessagesRowAttachments = connect(
  {
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
  },
  function CaseMessagesRowAttachments({
    attachments,
    docketNumber,
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
                      docketNumber,
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
