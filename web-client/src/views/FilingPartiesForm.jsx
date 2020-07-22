import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const FilingPartiesForm = connect(
  {
    caseDetail: state.caseDetail,
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
      <FormGroup errorText={filingPartiesFormHelper.partyValidationError}>
        <fieldset
          className={classNames(
            'usa-fieldset',
            !filingPartiesFormHelper.noMargin && 'margin-bottom-0',
          )}
        >
          <legend className="usa-legend">Who is filing this document?</legend>
          <div className="usa-checkbox">
            <input
              checked={form.partyPrimary || false}
              className="usa-checkbox__input"
              id="party-primary"
              name="partyPrimary"
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
              htmlFor="party-primary"
            >
              {caseDetail.contactPrimary.name}
            </label>
          </div>
          {filingPartiesFormHelper.showSecondaryParty && (
            <div className="usa-checkbox">
              <input
                checked={form.partySecondary || false}
                className="usa-checkbox__input"
                id="party-secondary"
                name="partySecondary"
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
                htmlFor="party-secondary"
              >
                {caseDetail.contactSecondary.name}
              </label>
            </div>
          )}
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
    );
  },
);
