import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PractitionerSearchByBarNumber = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    submitPractitionerBarNumberSearchSequence:
      sequences.submitPractitionerBarNumberSearchSequence,
    updateAdvancedSearchFormValueSequence:
      sequences.updateAdvancedSearchFormValueSequence,
    validatePractitionerSearchByBarNumberFormSequence:
      sequences.validatePractitionerSearchByBarNumberFormSequence,
    validationErrors: state.validationErrors,
  },
  function PractitionerSearchByBarNumber({
    advancedSearchForm,
    clearAdvancedSearchFormSequence,
    submitPractitionerBarNumberSearchSequence,
    updateAdvancedSearchFormValueSequence,
    validatePractitionerSearchByBarNumberFormSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="header-with-blue-background display-flex flex-justify">
          <h3>Search by Bar Number</h3>
        </div>
        <div className="blue-container">
          <form>
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-6">
                <FormGroup errorText={validationErrors.barNumber}>
                  <label className="usa-label" htmlFor="bar-number">
                    Bar number <span className="usa-hint">(required)</span>
                  </label>
                  <input
                    className="usa-input"
                    data-testid="bar-number"
                    id="bar-number"
                    name="barNumber"
                    type="text"
                    value={
                      advancedSearchForm.practitionerSearchByBarNumber
                        .barNumber || ''
                    }
                    onBlur={() => {
                      validatePractitionerSearchByBarNumberFormSequence();
                    }}
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'practitionerSearchByBarNumber',
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
                  data-testid="practitioner-search-by-bar-number-button"
                  id="practitioner-search-by-bar-number-button"
                  onClick={e => {
                    e.preventDefault();
                    submitPractitionerBarNumberSearchSequence();
                  }}
                >
                  Search
                </Button>
                <Button
                  link
                  className="margin-left-1 tablet:margin-left-205 margin-right-0 padding-0 ustc-button--mobile-inline"
                  data-testid="clear-practitioner-search"
                  onClick={e => {
                    e.preventDefault();
                    clearAdvancedSearchFormSequence({
                      formType: 'practitionerSearchByBarNumber',
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

PractitionerSearchByBarNumber.displayName = 'PractitionerSearchByBarNumber';
