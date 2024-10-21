import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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
              className="usa-textarea height-8 textarea-resize-vertical"
              id="filed-by"
              name="filedBy"
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
          <FormGroup
            errorText={filingPartiesFormHelper.partyValidationCheckboxError}
          >
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
              {filingPartiesFormHelper.showFilingPartiesAsCheckboxes ? (
                <>
                  {caseDetail.petitioners.map(petitioner => (
                    <div className="usa-checkbox" key={petitioner.contactId}>
                      <input
                        checked={
                          (form.filersMap &&
                            form.filersMap[petitioner.contactId]) ||
                          false
                        }
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
                        className="usa-checkbox__label"
                        data-testid="filed-by-option"
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
                      className="usa-checkbox__label"
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
                        validateSequence();
                      }}
                    />
                    <label
                      className="usa-checkbox__label"
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
                          onBlur={() => validateSequence()}
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
                </>
              ) : (
                <input
                  className="usa-input usa-input-inline"
                  name="otherFilingParty"
                  value={form.otherFilingParty || ''}
                  onChange={e => {
                    updateSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              )}
            </fieldset>
          </FormGroup>
        )}
      </>
    );
  },
);

FilingPartiesForm.displayName = 'FilingPartiesForm';
