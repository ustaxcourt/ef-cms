import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SearchByDocketNumber = connect(
  {
    clearDocketNumberSearchFormSequence:
      sequences.clearDocketNumberSearchFormSequence,
    docketNumberSearchForm: state.docketNumberSearchForm,
    updateDocketNumberSearchFormSequence:
      sequences.updateDocketNumberSearchFormSequence,
    validationErrors: state.validationErrors,
  },
  ({
    clearDocketNumberSearchFormSequence,
    docketNumberSearchForm,
    submitDocketNumberSearchSequence,
    updateDocketNumberSearchFormSequence,
    validationErrors,
  }) => {
    return (
      <>
        <div className="header-with-blue-background display-flex flex-justify">
          <h3>Search by Docket Number</h3>
          <NonMobile>
            <Button
              link
              className="margin-left-1 tablet:margin-left-205 margin-right-0 padding-0 ustc-button--mobile-inline"
              icon={['fas', 'times-circle']}
              onClick={() => {
                clearDocketNumberSearchFormSequence();
              }}
            >
              Clear search
            </Button>
          </NonMobile>
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
                    value={docketNumberSearchForm.docketNumber || ''}
                    onChange={e => {
                      updateDocketNumberSearchFormSequence({
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
                  className="advanced-search__button"
                  id="docket-search-button"
                  type="submit"
                >
                  Search
                </Button>
              </div>
            </div>

            <Mobile>
              <div className="grid-row">
                <div className="tablet:grid-col-5 text-center">
                  <Button
                    link
                    className="margin-left-1 tablet:margin-left-205 margin-right-0 padding-0 ustc-button--mobile-inline"
                    icon={['fas', 'times-circle']}
                    onClick={() => {
                      clearDocketNumberSearchFormSequence();
                    }}
                  >
                    Clear search
                  </Button>
                </div>
              </div>
            </Mobile>
          </form>
        </div>
      </>
    );
  },
);
