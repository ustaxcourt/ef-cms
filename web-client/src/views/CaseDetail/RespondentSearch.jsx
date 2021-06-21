import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const RespondentSearch = connect(
  {
    caseDetailHelper: state.caseDetailHelper,
    caseInformationHelper: state.caseInformationHelper,
    form: state.form,
    formattedCaseDetail: state.formattedCaseDetail,
    openAddIrsPractitionerModalSequence:
      sequences.openAddIrsPractitionerModalSequence,
    showModal: state.modal.showModal,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function RespondentSearch({
    form,
    openAddIrsPractitionerModalSequence,
    updateFormValueSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="grid-col-2">
          <div className="text-right">
            <span
              className="label margin-right-4 margin-top-05"
              id="respondent-counsel-search-description"
            >
              Add counsel
            </span>
          </div>
        </div>
        <div className="grid-col-4">
          <FormGroup
            className="margin-bottom-0 margin-top-0"
            errorText={validationErrors.respondentSearchError}
          >
            <form
              className="usa-search"
              onSubmit={e => {
                e.preventDefault();
                openAddIrsPractitionerModalSequence();
              }}
            >
              <div role="search">
                <label
                  className="usa-sr-only"
                  htmlFor="respondent-search-field"
                >
                  Search
                </label>
                <input
                  aria-describedby="respondent-counsel-search-description"
                  className={classNames(
                    'usa-input margin-bottom-0',
                    validationErrors.respondentSearchError &&
                      'usa-input--error',
                  )}
                  id="respondent-search-field"
                  name="respondentSearch"
                  placeholder="Enter bar no. or name"
                  type="search"
                  value={form.respondentSearch || ''}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
                <button
                  className="small-search-button usa-button"
                  id="search-for-respondent"
                  type="submit"
                >
                  <span className="usa-search__submit-text">Search</span>
                </button>
              </div>
            </form>
          </FormGroup>
        </div>
      </>
    );
  },
);

export { RespondentSearch };
