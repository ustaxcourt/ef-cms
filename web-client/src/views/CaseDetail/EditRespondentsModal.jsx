import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

class EditRespondentsModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: 'edit-counsel-modal',
      confirmLabel: 'Apply Changes',
      title: 'Edit Respondent Counsel',
    };
  }
  renderBody() {
    const { modal, updateModalValueSequence } = this.props;

    return (
      <div>
        {modal.respondents.map((respondent, idx) => (
          <div
            className="border border-base-light padding-2 margin-bottom-2 grid-row"
            key={idx}
          >
            <div className="grid-col-8">
              <label
                className="usa-label margin-bottom-0"
                htmlFor={`respondent-${idx}`}
              >
                {respondent.name} ({respondent.barNumber})
              </label>
            </div>
            <div className="grid-col-4 text-right text-secondary-dark">
              <div className="usa-checkbox" id={`respondent-${idx}`}>
                <input
                  checked={respondent.removeFromCase || false}
                  className="usa-checkbox__input"
                  id={`remove-respondent-${idx}`}
                  name={`respondents.${idx}.removeFromCase`}
                  type="checkbox"
                  onChange={e => {
                    updateModalValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  htmlFor={`remove-respondent-${idx}`}
                >
                  Remove from Case
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export const EditRespondentsModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.submitEditRespondentsModalSequence,
    constants: state.constants,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  EditRespondentsModalComponent,
);
