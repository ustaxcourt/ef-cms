import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const PartiesInformationContentHeader = connect(
  {
    caseInformationHelper: state.caseInformationHelper,
    form: state.form,
    openAddPrivatePractitionerModalSequence:
      sequences.openAddPrivatePractitionerModalSequence,
    partiesInformationHelper: state.partiesInformationHelper,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function PartiesInformationContentHeader({
    caseInformationHelper,
    form,
    openAddPrivatePractitionerModalSequence,
    title,
    updateFormValueSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="grid-row margin-bottom-2">
          <div className="grid-col-6">
            <h2>{title}</h2>
          </div>

          {caseInformationHelper.showAddCounsel && (
            <>
              <div className="grid-col-2">
                <div className="text-right">
                  <span
                    className="label margin-right-4 margin-top-05"
                    id="practitioner-counsel-search-description"
                  >
                    Add counsel
                  </span>
                </div>
              </div>
              <div className="grid-col-4">
                <FormGroup
                  className="margin-bottom-0 margin-top-0"
                  errorText={validationErrors.practitionerSearchError}
                >
                  <form
                    className="usa-search"
                    onSubmit={e => {
                      e.preventDefault();
                      openAddPrivatePractitionerModalSequence();
                    }}
                  >
                    <div role="search">
                      <label
                        className="usa-sr-only"
                        htmlFor="practitioner-search-field"
                      >
                        Search
                      </label>
                      <input
                        aria-describedby="practitioner-counsel-search-description"
                        className={classNames(
                          'usa-input margin-bottom-0',
                          validationErrors.practitionerSearchError &&
                            'usa-input--error',
                        )}
                        id="practitioner-search-field"
                        name="practitionerSearch"
                        placeholder="Enter bar no. or name"
                        type="search"
                        value={form.practitionerSearch || ''}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <button
                        className="small-search-button usa-button"
                        id="search-for-practitioner"
                        type="submit"
                      >
                        <span className="usa-search__submit-text">Search</span>
                      </button>
                    </div>
                  </form>
                </FormGroup>
              </div>
            </>
          )}
        </div>
      </>
    );
  },
);

export { PartiesInformationContentHeader };
