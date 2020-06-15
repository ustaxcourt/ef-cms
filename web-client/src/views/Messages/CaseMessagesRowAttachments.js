import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const CaseMessagesRowAttachments = ({ attachments }) => {
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
              {attachment.documentTitle}
            </div>
          );
        })}
    </>
  );
};
