import { ModalDialog } from '../ModalDialog';
import { ServiceIndicatorRadios } from '../ServiceIndicatorRadios';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditIrsPractitionersModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.submitEditIrsPractitionersModalSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateEditIrsPractitionersSequence:
      sequences.validateEditIrsPractitionersSequence,
    validationErrors: state.validationErrors,
  },
  function EditIrsPractitionersModal({
    cancelSequence,
    confirmSequence,
    modal,
    updateModalValueSequence,
    validateEditIrsPractitionersSequence,
    validationErrors,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className="edit-counsel-modal"
        confirmLabel="Apply Changes"
        confirmSequence={confirmSequence}
        title="Edit Respondent Counsel"
      >
        <div>
          {modal.irsPractitioners.map((respondent, idx) => (
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

                <div className="margin-top-2">
                  <ServiceIndicatorRadios
                    bind={`modal.irsPractitioners.${idx}`}
                    getValidationError={() =>
                      validationErrors.irsPractitioners &&
                      validationErrors.irsPractitioners[idx] &&
                      validationErrors.irsPractitioners[idx].serviceIndicator
                    }
                    validateSequence={validateEditIrsPractitionersSequence}
                  />
                </div>
              </div>
              <div className="grid-col-4 text-right text-secondary-dark">
                <div className="usa-checkbox" id={`respondent-${idx}`}>
                  <input
                    checked={respondent.removeFromCase || false}
                    className="usa-checkbox__input"
                    id={`remove-respondent-${idx}`}
                    name={`irsPractitioners.${idx}.removeFromCase`}
                    type="checkbox"
                    onChange={e => {
                      updateModalValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                    }}
                  />
                  <label
                    className="usa-checkbox__label inline-block"
                    htmlFor={`remove-respondent-${idx}`}
                  >
                    Remove from case
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ModalDialog>
    );
  },
);
