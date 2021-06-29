import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const FilingPartiesForm = connect(
  {
    caseDetail: state.formattedCaseDetail,
    filingPartiesFormHelper: state.filingPartiesFormHelper,
    form: state.form,
    validationErrors: state.validationErrors,
  },
  function FilingPartiesForm({
    caseDetail,
    filingPartiesFormHelper,
    form,
    updateSequence,
    validateSequence,
    validationErrors,
  }) {
    return (
      <>
        {filingPartiesFormHelper.isServed ? (
          <FormGroup errorText={validationErrors.filedBy}>
            <label className="usa-label" htmlFor="filed-by" id="filed-by-label">
              Filed by
            </label>
            <textarea
              aria-describedby="filed-by-label"
              className="usa-textarea height-8"
              id="filed-by"
              name="filedBy"
              type="text"
              value={form.filedBy || ''}
              onChange={e => {
                updateSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
        ) : (
          <FormGroup errorText={filingPartiesFormHelper.partyValidationError}>
            <fieldset
              aria-labelledby="filed-by-legend"
              className={classNames(
                'usa-fieldset',
                !filingPartiesFormHelper.noMargin && 'margin-bottom-0',
              )}
            >
              <legend className="usa-legend" id="filed-by-legend">
                Who is filing this document?
              </legend>
              {caseDetail.petitioners.map(petitioner => (
                <div className="usa-checkbox" key={petitioner.contactId}>
                  <input
                    checked={form.filersMap[petitioner.contactId] || false}
                    className="usa-checkbox__input"
                    id={`filing-${petitioner.contactId}`}
                    name={`filersMap.${petitioner.contactId}`}
                    type="checkbox"
                    onChange={e => {
                      updateSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      validateSequence();
                    }}
                  />
                  <label
                    className="usa-checkbox__label inline-block"
                    htmlFor={`filing-${petitioner.contactId}`}
                  >
                    {petitioner.displayName}
                  </label>
                </div>
              ))}
              <div className="usa-checkbox">
                <input
                  checked={form.partyIrsPractitioner || false}
                  className="usa-checkbox__input"
                  id="party-irs-practitioner"
                  name="partyIrsPractitioner"
                  type="checkbox"
                  onChange={e => {
                    updateSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                    validateSequence();
                  }}
                />
                <label
                  className="usa-checkbox__label inline-block"
                  htmlFor="party-irs-practitioner"
                >
                  Respondent
                </label>
              </div>
              <div className="usa-checkbox">
                <input
                  checked={form.hasOtherFilingParty || false}
                  className="usa-checkbox__input"
                  id="has-other-filing-party"
                  name="hasOtherFilingParty"
                  type="checkbox"
                  onChange={e => {
                    updateSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                  }}
                />
                <label
                  className="usa-checkbox__label inline-block"
                  htmlFor="has-other-filing-party"
                  id="has-other-filing-party-label"
                >
                  Other
                </label>
              </div>
              {form.hasOtherFilingParty && (
                <FormGroup errorText={validationErrors.otherFilingParty}>
                  <div>
                    <label
                      className="usa-label"
                      htmlFor="other-filing-party"
                      id="other-filing-party-label"
                    >
                      Other filing party name
                    </label>
                    <input
                      aria-describedby="other-filing-party-label"
                      className="usa-input"
                      id="other-filing-party"
                      name="otherFilingParty"
                      type="text"
                      value={form.otherFilingParty || ''}
                      onChange={e => {
                        updateSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </div>
                </FormGroup>
              )}
            </fieldset>
          </FormGroup>
        )}
      </>
    );
  },
);
