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
  ({
    advancedSearchForm,
    clearCaseSearchByNameFormSequence,
    submitPractitionerBarNumberSearchSequence,
    updateAdvancedSearchFormValueSequence,
    validationErrors,
  }) => {
    return (
      <>
        <div className="header-with-blue-background display-flex flex-justify">
          <h3>Search by Name</h3>
          <Button
            link
            className="margin-left-1 tablet:margin-left-205 margin-right-0 padding-0 ustc-button--mobile-inline"
            icon={['fas', 'times-circle']}
            onClick={() => {
              clearCaseSearchByNameFormSequence();
            }}
          >
            Clear Search
          </Button>
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
                    value={advancedSearchForm.practitionerName || ''}
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </FormGroup>
              </div>
            </div>

            <div className="grid-row">
              <div className="tablet:grid-col-5">
                <Button
                  className="advanced-search__button margin-top-2"
                  type="submit"
                >
                  Search
                </Button>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  },
);
