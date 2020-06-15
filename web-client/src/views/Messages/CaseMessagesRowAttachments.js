import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseMessagesRowAttachments = connect(
  {
    baseUrl: state.baseUrl,
    token: state.token,
  },
  function CaseMessagesRowAttachments({ attachments, baseUrl, caseId, token }) {
    return (
      <>
        {attachments &&
          attachments.length > 0 &&
          attachments.map(attachment => {
            return (
              <div className="margin-bottom-1" key={attachment.documentId}>
                <FontAwesomeIcon
                  className="fa-icon-blue"
                  icon="file-pdf"
                  size="1x"
                />
                <Button
                  link
                  className="padding-0"
                  href={`${baseUrl}/case-documents/${caseId}/${attachment.documentId}/document-download-url?token=${token}`}
                  rel="noopener noreferrer"
                  target="_blank"
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
