import { sequences, state } from 'cerebral';

import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import React from 'react';

class EditSecondaryContactModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      classNames: 'edit-secondary-contact-modal',
      confirmLabel: 'OK',
    };
  }

  renderBody() {
    return (
      <div>
        <h3 className="margin-bottom-3">
          Edit Contact Information for Other Petitioners
        </h3>
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
          form to the US Tax Court to update this information.
        </p>
      </div>
    );
  }
}

export const EditSecondaryContactModal = connect(
  {
    confirmSequence: sequences.dismissModalSequence,
  },
  EditSecondaryContactModalComponent,
);
