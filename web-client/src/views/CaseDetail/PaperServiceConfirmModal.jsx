import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PaperServiceConfirmModal = connect(
  { paperServiceParties: state.modal.paperServiceParties },
  ({ onConfirmSequence, paperServiceParties }) => (
    <ConfirmModal
      noCloseBtn
      cancelLabel="No, Cancel"
      confirmLabel="Yes, Delete"
      preventCancelOnBlur={true}
      title="Paper service is required for the following document:"
      onCancelSequence="clearModalSequence"
      onConfirmSequence={onConfirmSequence}
    >
      <p>The following document will be served on all parties:</p>

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
