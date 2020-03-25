import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { ServiceIndicatorRadios } from '../ServiceIndicatorRadios';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditPrivatePractitionersModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    caseDetail: state.caseDetail,
    confirmSequence: sequences.submitEditPrivatePractitionersModalSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateEditPrivatePractitionersSequence:
      sequences.validateEditPrivatePractitionersSequence,
    validationErrors: state.validationErrors,
  },
  function EditPrivatePractitionersModal({
    cancelSequence,
    caseDetail,
    confirmSequence,
    modal,
    updateModalValueSequence,
    validateEditPrivatePractitionersSequence,
    validationErrors,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className="edit-counsel-modal"
        confirmLabel="Apply Changes"
        confirmSequence={confirmSequence}
        title="Edit Petitioner Counsel"
      >
        <div>
          {modal.privatePractitioners.map((practitioner, idx) => (
            <div
              className="border border-base-light padding-2 margin-bottom-2 grid-row"
              key={idx}
            >
              <div className="grid-col-8">
                <label
                  className="usa-label"
                  htmlFor={`practitioner-representing-${idx}`}
                >
                  {practitioner.name} ({practitioner.barNumber})
                </label>
                <FormGroup
                  className="margin-bottom-0"
                  errorText={
                    validationErrors &&
                    validationErrors.privatePractitioners &&
                    validationErrors.privatePractitioners[idx] &&
                    validationErrors.privatePractitioners[idx]
                      .representingPrimary
                  }
                  id={`practitioner-representing-${idx}`}
                >
                  <fieldset className="usa-fieldset margin-bottom-0">
                    <legend
                      className="usa-legend usa-legend--text-normal"
                      id={`practitioner-representing-legend-${idx}`}
                    >
                      Representing
                    </legend>
                    <div className="usa-checkbox">
                      <input
                        aria-describedby={`practitioner-representing-legend-${idx}`}
                        checked={practitioner.representingPrimary || false}
                        className="usa-checkbox__input"
                        id={`representing-primary-${idx}`}
                        name={`privatePractitioners.${idx}.representingPrimary`}
                        type="checkbox"
                        onChange={e => {
                          updateModalValueSequence({
                            key: e.target.name,
                            value: e.target.checked,
                          });
                          validateEditPrivatePractitionersSequence();
                        }}
                      />
                      <label
                        className="usa-checkbox__label inline-block"
                        htmlFor={`representing-primary-${idx}`}
                      >
                        {caseDetail.contactPrimary.name}
                      </label>
                    </div>

                    {caseDetail.contactSecondary &&
                      caseDetail.contactSecondary.name && (
                        <div className="usa-checkbox">
                          <input
                            aria-describedby={`practitioner-representing-legend-${idx}`}
                            checked={
                              practitioner.representingSecondary || false
                            }
                            className="usa-checkbox__input"
                            id={`representing-secondary-${idx}`}
                            name={`privatePractitioners.${idx}.representingSecondary`}
                            type="checkbox"
                            onChange={e => {
                              updateModalValueSequence({
                                key: e.target.name,
                                value: e.target.checked,
                              });
                              validateEditPrivatePractitionersSequence();
                            }}
                          />
                          <label
                            className="usa-checkbox__label inline-block"
                            htmlFor={`representing-secondary-${idx}`}
                          >
                            {caseDetail.contactSecondary.name}
                          </label>
                        </div>
                      )}
                  </fieldset>
                  <div className="margin-top-2">
                    <ServiceIndicatorRadios
                      bind={`modal.privatePractitioners.${idx}`}
                      getValidationError={() =>
                        validationErrors.privatePractitioners &&
                        validationErrors.privatePractitioners[idx] &&
                        validationErrors.privatePractitioners[idx]
                          .serviceIndicator
                      }
                      validateSequence={
                        validateEditPrivatePractitionersSequence
                      }
                    />
                  </div>
                </FormGroup>
              </div>
              <div className="grid-col-4 text-right text-secondary-dark">
                <div className="usa-checkbox">
                  <input
                    checked={practitioner.removeFromCase || false}
                    className="usa-checkbox__input"
                    id={`remove-practitioner-${idx}`}
                    name={`privatePractitioners.${idx}.removeFromCase`}
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
                    htmlFor={`remove-practitioner-${idx}`}
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
