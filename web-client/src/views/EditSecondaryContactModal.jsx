import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

class EditSecondaryContactModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      confirmLabel: 'OK',
      title: 'Edit Contact Information for Other Petitioners',
    };
  }

  renderBody() {
    return (
      <div>
        <p>
          Contact information for other petitioners, such as spouses and
          business partners, cannot be updated online at this time. Please have
          them complete and mail a{' '}
          <a
            href="https://ustaxcourt.gov/forms/NOCOA_Form_10.pdf"
            rel="noopener noreferrer"
            target="_blank"
          >
            Notice of Change of Address
          </a>{' '}
          form to the U.S. Tax Court to update this information.
        </p>
      </div>
    );
  }
}

export const EditSecondaryContactModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.dismissModalSequence,
  },
  EditSecondaryContactModalComponent,
);
