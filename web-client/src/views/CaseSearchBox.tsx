import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const CaseSearchBox = connect(
  {
    caseSearchBoxHelper: state.caseSearchBoxHelper,
    searchTerm: state.header.searchTerm,
    submitCaseSearchSequence: sequences.submitCaseSearchSequence,
    updateSearchTermSequence: sequences.updateSearchTermSequence,
  },
  function CaseSearchBox({
    caseSearchBoxHelper,
    searchTerm,
    submitCaseSearchSequence,
    updateSearchTermSequence,
  }) {
    return (
      <>
        <form
          onSubmit={e => {
            e.preventDefault();
            submitCaseSearchSequence();
          }}
        >
          <div className="case-search margin-bottom-4">
            <div className="card">
              <div className="content-wrapper gray">
                <div className="grid-row underlined">
                  <div className="grid-col-8">
                    <h3>Search for a Case</h3>
                  </div>
                  <div className="tablet:grid-col-4 padding-top-05">
                    {caseSearchBoxHelper.showAdvancedSearch && (
                      <a
                        className="usa-link float-right"
                        data-testid="advanced-search-link"
                        href="/search"
                        id="advanced-search-button"
                      >
                        Advanced Search
                      </a>
                    )}
                  </div>
                </div>
                {caseSearchBoxHelper.showSearchDescription && (
                  <p>
                    To file an Entry of Appearance, Substitution of Counsel,
                    etc.
                  </p>
                )}
                <div
                  className={classNames(
                    'usa-form-group margin-bottom-4',
                    !caseSearchBoxHelper.showSearchDescription &&
                      'margin-top-3',
                  )}
                >
                  <div>
                    <label
                      className={classNames(
                        'usa-label',
                        !caseSearchBoxHelper.showAdvancedSearch &&
                          'margin-top-2',
                      )}
                      htmlFor="docket-search-field"
                    >
                      Docket number
                    </label>
                    <input
                      className="usa-input"
                      data-testid="docket-search-field"
                      id="docket-search-field"
                      name="searchTerm"
                      placeholder="Enter docket number (e.g., 123-19)"
                      type="text"
                      value={searchTerm}
                      onChange={e => {
                        updateSearchTermSequence({
                          searchTerm: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>

                <Button
                  secondary
                  data-testid="search-by-docket-number"
                  type="submit"
                >
                  <span className="usa-search-submit-text">Search</span>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  },
);

CaseSearchBox.displayName = 'CaseSearchBox';
