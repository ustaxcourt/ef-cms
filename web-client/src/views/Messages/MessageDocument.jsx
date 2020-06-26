import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const MessageDocument = connect(
  {
    attachmentDocumentToDisplay: state.attachmentDocumentToDisplay,
    iframeSrc: state.iframeSrc,
  },
  function MessageDocument({ attachmentDocumentToDisplay, iframeSrc }) {
    return (
      <div className="message-detail--attachments">
        {!attachmentDocumentToDisplay && (
          <div className="padding-2">There are no attachments to preview</div>
        )}

        {!process.env.CI && attachmentDocumentToDisplay && (
          <>
            <div className="message-document-actions">
              <Button link icon="edit" onClick={() => null}>
                Edit
              </Button>

              <Button link icon="pencil-alt" onClick={() => null}>
                Apply Signature
              </Button>

              <Button link icon="plus-circle" onClick={() => null}>
                Add Docket Entry
              </Button>

              <Button
                link
                icon="file-pdf"
                iconColor="white"
                onClick={() => null}
              >
                View Full PDF
              </Button>
            </div>
            <iframe
              src={iframeSrc}
              title={attachmentDocumentToDisplay.documentTitle}
            />
          </>
        )}
      </div>
    );
  },
);
