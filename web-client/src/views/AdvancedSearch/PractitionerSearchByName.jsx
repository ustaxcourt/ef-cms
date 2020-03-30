import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PractitionerSearchByName = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    clearCaseSearchByNameFormSequence:
      sequences.clearCaseSearchByNameFormSequence,
    updateAdvancedSearchFormValueSequence:
      sequences.updateAdvancedSearchFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function PractitionerSearchByName({
    advancedSearchForm,
    clearCaseSearchByNameFormSequence,
    submitPractitionerBarNumberSearchSequence,
    updateAdvancedSearchFormValueSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="header-with-blue-background display-flex flex-justify">
          <h3>Search by Name</h3>
        </div>
        <div className="blue-container">
          <form
            onSubmit={e => {
              e.preventDefault();
              submitPractitionerBarNumberSearchSequence();
            }}
          >
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-6">
                <FormGroup errorText={validationErrors.practitionerName}>
                  <label className="usa-label" htmlFor="practitioner-name">
                    Practitioner name{' '}
                    <span className="usa-hint">(required)</span>
                  </label>
                  <input
                    className="usa-input"
                    id="practitioner-name"
                    name="practitionerName"
                    type="text"
                    value={
                      advancedSearchForm.practitionerSearchByName
                        .practitionerName || ''
                    }
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
                  type="submit"
                >
                  Search
                </Button>
                <Button
                  link
                  className="margin-left-1 tablet:margin-left-205 margin-right-0 padding-0 ustc-button--mobile-inline"
                  onClick={() => {
                    clearCaseSearchByNameFormSequence();
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
