import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseSearchByDocketNumber = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    clearDocketNumberSearchFormSequence:
      sequences.clearDocketNumberSearchFormSequence,
    updateAdvancedSearchFormValueSequence:
      sequences.updateAdvancedSearchFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function CaseSearchByDocketNumber({
    advancedSearchForm,
    clearDocketNumberSearchFormSequence,
    submitDocketNumberSearchSequence,
    updateAdvancedSearchFormValueSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="header-with-blue-background display-flex flex-justify">
          <h3>Search by Docket Number</h3>
        </div>
        <div className="blue-container advanced-search__form-container">
          <form
            onSubmit={e => {
              e.preventDefault();
              submitDocketNumberSearchSequence();
            }}
          >
            <div className="grid-row">
              <div className="tablet:grid-col-6">
                <FormGroup
                  className="margin-bottom-0"
                  errorText={validationErrors.docketNumber}
                >
                  <label className="usa-label" htmlFor="docket-number">
                    Docket number <span className="usa-hint">(required)</span>
                  </label>
                  <span className="usa-hint">
                    Example of docket number format: 123-19
                  </span>
                  <input
                    className="usa-input"
                    id="docket-number"
                    name="docketNumber"
                    type="text"
                    value={
                      advancedSearchForm.caseSearchByDocketNumber
                        .docketNumber || ''
                    }
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'caseSearchByDocketNumber',
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
                  className="advanced-search__button"
                  id="docket-search-button"
                  type="submit"
                >
                  Search
                </Button>
                <Button
                  link
                  className="margin-left-1 tablet:margin-left-205 margin-right-0 padding-0 ustc-button--mobile-inline"
                  onClick={() => {
                    clearDocketNumberSearchFormSequence();
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
