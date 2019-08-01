import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

class AddCounselModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: '',
      confirmLabel: 'Add to Case',
    };

    if (props.form.counselType === 'practitioner') {
      this.modal.title = 'Add Petitioner Counsel';
    } else if (props.form.counselType === 'respondent') {
      this.modal.title = 'Add Respondent Counsel';
    }

    //hardcoded for now until the counsel search is built
    this.counselMatches = {
      practitioner: [
        {
          addressLine2: 'Los Angeles, CA 98089',
          barNumber: 'PT1234',
          name: 'Test Practitioner',
          userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
        },
        {
          addressLine2: 'Los Angeles, CA 98089',
          barNumber: 'PT5432',
          name: 'Test Practitioner1',
          userId: 'ad07b846-8933-4778-9fe2-b5d8ac8ad728',
        },
      ],
      respondent: [
        {
          addressLine2: 'Hicksville, NY 11612',
          barNumber: 'WN7777',
          name: 'Nero West',
          userId: '2d9a7229-7d5a-459f-84ad-754504a9f10f',
        },
        {
          addressLine2: 'Shellsburg, IA 52332',
          barNumber: 'MS8888',
          name: 'Stuart Morrison',
          userId: '5c43a30d-9c3d-41be-ad13-3b6d7cef54fc',
        },
      ],
    };
  }

  renderBody() {
    return (
      <div className="ustc-add-counsel-modal">
        <div className="usa-form-group">
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend className="usa-legend" id="counsel-matches-legend">
              Counsel Match(es) Found
            </legend>

            {this.counselMatches[this.props.form.counselType] &&
              this.counselMatches[this.props.form.counselType].length === 1 && (
                <span>
                  {this.counselMatches[this.props.form.counselType][0].name} (
                  {
                    this.counselMatches[this.props.form.counselType][0]
                      .barNumber
                  }
                  )
                  <br />
                  {
                    this.counselMatches[this.props.form.counselType][0]
                      .addressLine2
                  }
                </span>
              )}

            {this.counselMatches[this.props.form.counselType] &&
              this.counselMatches[this.props.form.counselType].length > 1 &&
              this.counselMatches[this.props.form.counselType].map(
                (counsel, idx) => (
                  <div className="usa-radio" key={idx}>
                    <input
                      aria-describedby="counsel-matches-legend"
                      checked={
                        this.props.form.selectedCounsel === counsel.userId ||
                        false
                      }
                      className="usa-radio__input"
                      id={`counsel-${idx}`}
                      name="selectedCounsel"
                      type="radio"
                      value={counsel.userId}
                      onChange={e => {
                        this.props.updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      htmlFor={`counsel-${idx}`}
                    >
                      {counsel.name} ({counsel.barNumber})
                      <br />
                      {counsel.addressLine2}
                    </label>
                  </div>
                ),
              )}
          </fieldset>
        </div>

        {this.props.form.counselType === 'practitioner' && (
          <div className="usa-form-group">
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend id="representing-legend">
                Who is This Counsel Representing?
              </legend>
              <div className="usa-checkbox">
                <input
                  aria-describedby="representing-legend"
                  checked={this.props.form.representingPrimary || false}
                  className="usa-checkbox__input"
                  id="party-primary"
                  name="representingPrimary"
                  type="checkbox"
                  onChange={e => {
                    this.props.updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                  }}
                />
                <label className="usa-checkbox__label" htmlFor="party-primary">
                  {this.props.caseDetail.contactPrimary.name}
                </label>
              </div>
              {this.props.caseDetail.contactSecondary &&
                this.props.caseDetail.contactSecondary.name && (
                  <div className="usa-checkbox">
                    <input
                      aria-describedby="representing-legend"
                      checked={this.props.form.representingSecondary || false}
                      className="usa-checkbox__input"
                      id="party-secondary"
                      name="representingSecondary"
                      type="checkbox"
                      onChange={e => {
                        this.props.updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.checked,
                        });
                      }}
                    />
                    <label
                      className="usa-checkbox__label"
                      htmlFor="party-secondary"
                    >
                      {this.props.caseDetail.contactSecondary.name}
                    </label>
                  </div>
                )}
            </fieldset>
          </div>
        )}
      </div>
    );
  }
}

export const AddCounselModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    caseDetail: state.formattedCaseDetail,
    confirmSequence: sequences.submitAddCounselModalSequence, //TODO
    constants: state.constants,
    form: state.form,
    modal: state.modal,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateSequence: sequences.validateAddCounselSequence, //TODO
    validationErrors: state.validationErrors,
  },
  AddCounselModalComponent,
);
