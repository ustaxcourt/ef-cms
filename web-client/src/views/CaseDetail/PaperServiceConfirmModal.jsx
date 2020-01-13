import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PaperServiceConfirmModal = connect(
  {
    documentTitle: state.form.documentTitle,
    paperServiceParties: state.modal.paperServiceParties,
  },
  ({ documentTitle, onConfirmSequence, paperServiceParties }) => (
    <ConfirmModal
      noCancel
      confirmLabel="Print Now"
      title="Paper service is required for the following document:"
      onConfirmSequence={onConfirmSequence}
    >
      <p>The following document will be served on all parties:</p>

      <p>{documentTitle}</p>

      <Hint exclamation fullWidth className="block">
        <div className="margin-bottom-1">
          This case has parties receiving paper service:
        </div>
        {paperServiceParties.map(contact => (
          <div className="margin-bottom-1" key={contact.name}>
            {contact.name}
          </div>
        ))}
      </Hint>
    </ConfirmModal>
  ),
);
