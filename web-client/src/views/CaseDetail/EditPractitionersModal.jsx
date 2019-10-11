import { ModalDialog } from '../ModalDialog';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

class EditPractitionersModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: 'edit-counsel-modal',
      confirmLabel: 'Apply Changes',
      title: 'Edit Petitioner Counsel',
    };
  }
  renderBody() {
    const {
      caseDetail,
      modal,
      updateModalValueSequence,
      validateSequence,
      validationErrors,
    } = this.props;

    return (
      <div>
        {caseDetail.practitioners.map((practitioner, idx) => (
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
              <div
                className={classNames(
                  'usa-form-group margin-bottom-0',
                  validationErrors.representingPrimary &&
                    'usa-form-group--error',
                )}
                id={`practitioner-representing-${idx}`}
              >
                <fieldset className="usa-fieldset margin-bottom-0">
                  <legend className="usa-legend usa-legend--text-normal">
                    Representing
                  </legend>
                  <div className="usa-checkbox">
                    <input
                      aria-describedby="representing-legend"
                      checked={this.modal.representingPrimary || false}
                      className="usa-checkbox__input"
                      id="party-primary"
                      name="representingPrimary"
                      type="checkbox"
                      onChange={e => {
                        updateModalValueSequence({
                          key: e.target.name,
                          value: e.target.checked,
                        });
                        validateSequence();
                      }}
                    />
                    <label
                      className="usa-checkbox__label"
                      htmlFor="party-primary"
                    >
                      {caseDetail.contactPrimary.name}
                    </label>
                  </div>

                  {caseDetail.contactSecondary &&
                    caseDetail.contactSecondary.name && (
                      <div className="usa-checkbox">
                        <input
                          aria-describedby="representing-legend"
                          checked={modal.representingSecondary || false}
                          className="usa-checkbox__input"
                          id="party-secondary"
                          name="representingSecondary"
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
                          htmlFor="party-secondary"
                        >
                          {caseDetail.contactSecondary.name}
                        </label>
                      </div>
                    )}
                  <Text
                    bind="validationErrors.representingPrimary"
                    className="usa-error-message"
                  />
                </fieldset>
              </div>
            </div>
            <div className="grid-col-4 text-right text-secondary-dark">
              <div className="usa-checkbox">
                <input
                  aria-describedby="representing-legend"
                  checked={modal.representingSecondary || false}
                  className="usa-checkbox__input"
                  id={`remove-practitioner-${idx}`}
                  name={`removePractitioner${idx}`}
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
                  htmlFor={`remove-practitioner-${idx}`}
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

export const EditPractitionersModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    //confirmSequence: sequences.updateCaseDeadlineSequence, //TODO
    caseDetail: state.caseDetail,
    constants: state.constants,
    form: state.form,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validationErrors: state.validationErrors,
  },
  EditPractitionersModalComponent,
);
