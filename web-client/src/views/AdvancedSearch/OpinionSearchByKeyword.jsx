import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OpinionSearchByKeyword = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    updateAdvancedSearchFormValueSequence:
      sequences.updateAdvancedSearchFormValueSequence,
    validateOpinionSearchSequence: sequences.validateOpinionSearchSequence,
    validationErrors: state.validationErrors,
  },
  function OpinionSearchByKeyword({
    advancedSearchForm,
    updateAdvancedSearchFormValueSequence,
    validateOpinionSearchSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="grid-row grid-gap">
          <div className="tablet:grid-col-12">
            <h4>Enter Keyword or Phrase</h4>
            <FormGroup errorText={validationErrors.keyword}>
              <label className="usa-label" htmlFor="opinion-search">
                Search for...
              </label>
              <input
                className="usa-input"
                id="opinion-search"
                name="keyword"
                type="text"
                value={advancedSearchForm.opinionSearch.keyword || ''}
                onBlur={() => validateOpinionSearchSequence()}
                onChange={e => {
                  updateAdvancedSearchFormValueSequence({
                    formType: 'opinionSearch',
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
          </div>
        </div>
      </>
    );
  },
);
