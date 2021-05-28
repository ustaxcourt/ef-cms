import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseSearchByDocketNumber = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    updateAdvancedSearchFormValueSequence:
      sequences.updateAdvancedSearchFormValueSequence,
    validateCaseDocketNumberSearchFormSequence:
      sequences.validateCaseDocketNumberSearchFormSequence,
    validationErrors: state.validationErrors,
  },
  function CaseSearchByDocketNumber({
    advancedSearchForm,
    clearAdvancedSearchFormSequence,
    submitDocketNumberSearchSequence,
    updateAdvancedSearchFormValueSequence,
    validateCaseDocketNumberSearchFormSequence,
    validationErrors,
  }) {
    return (
      <>
        <div
          className="header-with-blue-background display-flex flex-justify"
          id="search-by-docket-number"
        >
          <h3>Search by Docket Number</h3>
        </div>
        <div className="blue-container advanced-search__form-container">
          <form>
            <div className="grid-row">
              <div className="tablet:grid-col-6">
                <FormGroup errorText={validationErrors.docketNumber}>
                  <label
                    className="usa-label  margin-bottom-0"
                    htmlFor="docket-number"
                  >
                    Docket number <span className="usa-hint">(required)</span>
                  </label>
                  <span className="usa-hint">
                    Example of docket number format: 123-19
                  </span>
                  <input
                    aria-describedby="search-by-docket-number"
                    className="usa-input"
                    id="docket-number"
                    name="docketNumber"
                    type="text"
                    value={
                      advancedSearchForm.caseSearchByDocketNumber
                        .docketNumber || ''
                    }
                    onBlur={() => {
                      validateCaseDocketNumberSearchFormSequence();
                    }}
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'caseSearchByDocketNumber',
                        key: e.target.name,
                        value: e.target.value.toUpperCase(),
                      });
                    }}
                  />
                </FormGroup>
              </div>
            </div>

            <div className="grid-row">
              <div className="tablet:grid-col-6">
                <Button
                  aria-describedby="search-by-docket-number"
                  className="advanced-search__button"
                  id="docket-search-button"
                  onClick={e => {
                    e.preventDefault();
                    submitDocketNumberSearchSequence();
                  }}
                >
                  Search
                </Button>
                <Button
                  link
                  aria-describedby="search-by-docket-number"
                  className="margin-left-1 tablet:margin-left-205 margin-right-0 padding-0 ustc-button--mobile-inline"
                  onClick={e => {
                    e.preventDefault();
                    clearAdvancedSearchFormSequence({
                      formType: 'caseSearchByDocketNumber',
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
