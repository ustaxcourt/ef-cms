import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PractitionerSearchByName = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    submitPractitionerNameSearchSequence:
      sequences.submitPractitionerNameSearchSequence,
    updateAdvancedSearchFormValueSequence:
      sequences.updateAdvancedSearchFormValueSequence,
    validatePractitionerSearchByNameFormSequence:
      sequences.validatePractitionerSearchByNameFormSequence,
    validationErrors: state.validationErrors,
  },
  function PractitionerSearchByName({
    advancedSearchForm,
    clearAdvancedSearchFormSequence,
    submitPractitionerNameSearchSequence,
    updateAdvancedSearchFormValueSequence,
    validatePractitionerSearchByNameFormSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="header-with-blue-background display-flex flex-justify">
          <h3>Search by Name</h3>
        </div>
        <div className="blue-container">
          <form>
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-6">
                <FormGroup errorText={validationErrors.practitionerName}>
                  <label className="usa-label" htmlFor="practitioner-name">
                    Practitioner name{' '}
                    <span className="usa-hint">(required)</span>
                  </label>
                  <input
                    className="usa-input"
                    data-testid="practitioner-name"
                    id="practitioner-name"
                    name="practitionerName"
                    type="text"
                    value={
                      advancedSearchForm.practitionerSearchByName
                        .practitionerName || ''
                    }
                    onBlur={() => {
                      validatePractitionerSearchByNameFormSequence();
                    }}
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'practitionerSearchByName',
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </FormGroup>
              </div>
            </div>

            <div className="grid-row">
              <div className="tablet:grid-col-6">
                <Button
                  className="advanced-search__button margin-top-2"
                  data-testid="practitioner-search-by-name-button"
                  id="practitioner-search-by-name-button"
                  onClick={e => {
                    e.preventDefault();
                    submitPractitionerNameSearchSequence();
                  }}
                >
                  Search
                </Button>
                <Button
                  link
                  className="margin-left-1 tablet:margin-left-205 margin-right-0 padding-0 ustc-button--mobile-inline"
                  onClick={e => {
                    e.preventDefault();
                    clearAdvancedSearchFormSequence({
                      formType: 'practitionerSearchByName',
                    });
                  }}
                >
                  Clear Search
                </Button>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  },
);

PractitionerSearchByName.displayName = 'PractitionerSearchByName';
